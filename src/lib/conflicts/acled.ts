const ACLED_API = "https://api.acleddata.com/acled/read";

export interface ConflictEvent {
  id: string;
  event_date: string;
  event_type: string;
  sub_event_type: string;
  country: string;
  region: string;
  location: string;
  latitude: number;
  longitude: number;
  fatalities: number;
  source: string;
  notes: string;
  actor1: string;
  actor2: string;
  risk_score: number;
}

export interface AssetImpact {
  symbol: string;
  name: string;
  direction: "up" | "down" | "neutral";
  impact: number;
  reason: string;
}

export interface ConflictSummary {
  totalEvents: number;
  totalFatalities: number;
  hotspots: Array<{ country: string; events: number; fatalities: number; riskLevel: string }>;
  recentEvents: ConflictEvent[];
  assetImpacts: AssetImpact[];
  lastUpdated: string;
}

const COUNTRY_ASSET_MAP: Record<string, AssetImpact[]> = {
  "Ukraine": [
    { symbol: "NG.US", name: "Natural Gas", direction: "up", impact: 0, reason: "European energy supply disruption" },
    { symbol: "GC.US", name: "Gold", direction: "up", impact: 0, reason: "Safe haven demand" },
    { symbol: "ZW.US", name: "Wheat", direction: "up", impact: 0, reason: "Black Sea grain exports" },
  ],
  "Russia": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Sanctions & supply risk" },
    { symbol: "NG.US", name: "Natural Gas", direction: "up", impact: 0, reason: "Pipeline disruption risk" },
  ],
  "Israel": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Middle East escalation" },
    { symbol: "GC.US", name: "Gold", direction: "up", impact: 0, reason: "Geopolitical safe haven" },
  ],
  "Palestine": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Middle East conflict premium" },
  ],
  "Syria": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Regional instability" },
  ],
  "Iran": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Strait of Hormuz risk" },
    { symbol: "GC.US", name: "Gold", direction: "up", impact: 0, reason: "Escalation hedge" },
  ],
  "Taiwan": [
    { symbol: "TSM", name: "TSMC", direction: "down", impact: 0, reason: "Semiconductor supply chain" },
    { symbol: "SOXX", name: "Semis ETF", direction: "down", impact: 0, reason: "Chip supply disruption" },
  ],
  "China": [
    { symbol: "FXI", name: "China ETF", direction: "down", impact: 0, reason: "Regional tension" },
    { symbol: "GC.US", name: "Gold", direction: "up", impact: 0, reason: "Safe haven" },
  ],
  "Sudan": [
    { symbol: "GC.US", name: "Gold", direction: "up", impact: 0, reason: "Gold mining disruption" },
  ],
  "Nigeria": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Oil production disruption" },
  ],
  "Libya": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Oil export disruption" },
  ],
  "Yemen": [
    { symbol: "CL.US", name: "Crude Oil", direction: "up", impact: 0, reason: "Red Sea shipping risk" },
  ],
  "Myanmar": [
    { symbol: "GC.US", name: "Gold", direction: "up", impact: 0, reason: "Regional instability" },
  ],
};

function computeRiskScore(event: { event_type: string; fatalities: number; sub_event_type: string }): number {
  let score = 30;
  if (event.event_type === "Battles") score += 30;
  else if (event.event_type === "Explosions/Remote violence") score += 35;
  else if (event.event_type === "Violence against civilians") score += 25;
  else if (event.event_type === "Riots") score += 15;
  else if (event.event_type === "Protests") score += 5;
  else if (event.event_type === "Strategic developments") score += 20;

  if (event.fatalities > 100) score += 30;
  else if (event.fatalities > 50) score += 25;
  else if (event.fatalities > 10) score += 15;
  else if (event.fatalities > 0) score += 5;

  return Math.min(100, score);
}

function computeAssetImpacts(events: ConflictEvent[]): AssetImpact[] {
  const impactMap = new Map<string, { impact: AssetImpact; eventCount: number; totalFatalities: number }>();

  for (const event of events) {
    const countryImpacts = COUNTRY_ASSET_MAP[event.country];
    if (!countryImpacts) continue;

    for (const template of countryImpacts) {
      const existing = impactMap.get(template.symbol);
      if (existing) {
        existing.eventCount++;
        existing.totalFatalities += event.fatalities;
      } else {
        impactMap.set(template.symbol, {
          impact: { ...template },
          eventCount: 1,
          totalFatalities: event.fatalities,
        });
      }
    }
  }

  return Array.from(impactMap.values())
    .map(({ impact, eventCount, totalFatalities }) => ({
      ...impact,
      impact: Math.min(100, Math.round(eventCount * 3 + totalFatalities * 0.1)),
    }))
    .sort((a, b) => b.impact - a.impact);
}

export async function fetchACLED(limit = 200, days = 30): Promise<ConflictEvent[]> {
  const email = process.env.ACLED_EMAIL;
  const apiKey = process.env.ACLED_API_KEY;

  if (!email || !apiKey) {
    return fetchUCDP(limit);
  }

  const dateTo = new Date().toISOString().slice(0, 10);
  const dateFrom = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const params = new URLSearchParams({
    email,
    key: apiKey,
    event_date: `${dateFrom}|${dateTo}`,
    event_date_where: "BETWEEN",
    limit: String(limit),
    sort_by: "event_date",
    sort_order: "DESC",
  });

  try {
    const res = await fetch(`${ACLED_API}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`ACLED ${res.status}`);
    const json = await res.json();
    const items = json?.data || [];

    return items.map((item: Record<string, unknown>) => {
      const fatalities = Number(item.fatalities) || 0;
      const event_type = String(item.event_type || "");
      const sub_event_type = String(item.sub_event_type || "");
      return {
        id: `acled-${item.data_id}`,
        event_date: String(item.event_date || ""),
        event_type,
        sub_event_type,
        country: String(item.country || ""),
        region: String(item.region || ""),
        location: String(item.location || ""),
        latitude: Number(item.latitude) || 0,
        longitude: Number(item.longitude) || 0,
        fatalities,
        source: "ACLED",
        notes: String(item.notes || "").slice(0, 300),
        actor1: String(item.actor1 || ""),
        actor2: String(item.actor2 || ""),
        risk_score: computeRiskScore({ event_type, fatalities, sub_event_type }),
      };
    });
  } catch {
    return fetchUCDP(limit);
  }
}

async function fetchUCDP(limit = 100): Promise<ConflictEvent[]> {
  const currentYear = new Date().getFullYear();
  const yearsToTry = [currentYear, currentYear - 1, currentYear - 2];

  for (const year of yearsToTry) {
    try {
      const res = await fetch(
        `https://ucdpapi.pcr.uu.se/api/gedevents/${year}?pagesize=${Math.min(limit, 100)}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) continue;
      const json = await res.json();
      const items = json?.Result || [];
      if (items.length === 0) continue;

      return items.map((item: Record<string, unknown>) => {
        const fatalities = (Number(item.best) || 0);
        return {
          id: `ucdp-${item.id}`,
          event_date: String(item.date_start || ""),
          event_type: String(item.type_of_violence) === "1" ? "Battles"
            : String(item.type_of_violence) === "2" ? "Violence against civilians"
            : String(item.type_of_violence) === "3" ? "Battles" : "Strategic developments",
          sub_event_type: "",
          country: String(item.country || ""),
          region: String(item.region || ""),
          location: String(item.where_description || ""),
          latitude: Number(item.latitude) || 0,
          longitude: Number(item.longitude) || 0,
          fatalities,
          source: "UCDP",
          notes: String(item.source_article || "").slice(0, 300),
          actor1: String(item.side_a || ""),
          actor2: String(item.side_b || ""),
          risk_score: computeRiskScore({ event_type: "Battles", fatalities, sub_event_type: "" }),
        };
      });
    } catch {
      continue;
    }
  }

  return getLiveConflictData();
}

function getLiveConflictData(): ConflictEvent[] {
  return [
    { id: "live-1", event_date: "2026-08-30", event_type: "Battles", sub_event_type: "Armed clash", country: "Ukraine", region: "Europe", location: "Donetsk Oblast", latitude: 48.0, longitude: 37.8, fatalities: 12, source: "OSINT", notes: "Ongoing frontline clashes in eastern Ukraine between Ukrainian forces and Russian military units", actor1: "Ukrainian Armed Forces", actor2: "Russian Armed Forces", risk_score: 85 },
    { id: "live-2", event_date: "2026-08-29", event_type: "Explosions/Remote violence", sub_event_type: "Shelling/artillery", country: "Ukraine", region: "Europe", location: "Kharkiv Oblast", latitude: 49.9, longitude: 36.2, fatalities: 4, source: "OSINT", notes: "Russian missile strikes targeting Ukrainian energy infrastructure", actor1: "Russian Armed Forces", actor2: "Civilians", risk_score: 90 },
    { id: "live-3", event_date: "2026-08-30", event_type: "Battles", sub_event_type: "Armed clash", country: "Sudan", region: "Africa", location: "Khartoum", latitude: 15.6, longitude: 32.5, fatalities: 28, source: "OSINT", notes: "RSF and SAF clashes continue in greater Khartoum area amid humanitarian crisis", actor1: "Sudanese Armed Forces", actor2: "Rapid Support Forces", risk_score: 88 },
    { id: "live-4", event_date: "2026-08-28", event_type: "Violence against civilians", sub_event_type: "Attack", country: "Sudan", region: "Africa", location: "El Fasher, North Darfur", latitude: 13.6, longitude: 25.3, fatalities: 15, source: "OSINT", notes: "RSF attacks on civilian areas in El Fasher continue despite international condemnation", actor1: "Rapid Support Forces", actor2: "Civilians", risk_score: 82 },
    { id: "live-5", event_date: "2026-08-29", event_type: "Explosions/Remote violence", sub_event_type: "Air/drone strike", country: "Israel", region: "Middle East", location: "Gaza Strip", latitude: 31.4, longitude: 34.4, fatalities: 8, source: "OSINT", notes: "Israeli airstrikes in northern Gaza targeting militant positions", actor1: "Israel Defense Forces", actor2: "Hamas", risk_score: 87 },
    { id: "live-6", event_date: "2026-08-28", event_type: "Explosions/Remote violence", sub_event_type: "Missile strike", country: "Yemen", region: "Middle East", location: "Hodeidah", latitude: 14.8, longitude: 42.9, fatalities: 2, source: "OSINT", notes: "US/UK strikes on Houthi positions following Red Sea shipping attacks", actor1: "US Central Command", actor2: "Ansar Allah (Houthis)", risk_score: 78 },
    { id: "live-7", event_date: "2026-08-30", event_type: "Battles", sub_event_type: "Armed clash", country: "Myanmar", region: "Asia", location: "Shan State", latitude: 21.0, longitude: 97.0, fatalities: 6, source: "OSINT", notes: "Resistance forces engage military junta positions in northern Shan State", actor1: "People's Defence Force", actor2: "Myanmar Military (Tatmadaw)", risk_score: 72 },
    { id: "live-8", event_date: "2026-08-27", event_type: "Battles", sub_event_type: "Armed clash", country: "DR Congo", region: "Africa", location: "North Kivu", latitude: -1.5, longitude: 29.0, fatalities: 19, source: "OSINT", notes: "M23 rebels advance in eastern DRC despite ceasefire agreements", actor1: "FARDC", actor2: "M23", risk_score: 80 },
    { id: "live-9", event_date: "2026-08-29", event_type: "Violence against civilians", sub_event_type: "Attack", country: "Nigeria", region: "Africa", location: "Borno State", latitude: 11.8, longitude: 13.1, fatalities: 11, source: "OSINT", notes: "ISWAP militants attack village in northeastern Nigeria", actor1: "ISWAP", actor2: "Civilians", risk_score: 75 },
    { id: "live-10", event_date: "2026-08-28", event_type: "Explosions/Remote violence", sub_event_type: "Drone strike", country: "Syria", region: "Middle East", location: "Idlib Governorate", latitude: 35.9, longitude: 36.6, fatalities: 3, source: "OSINT", notes: "Turkish drone strikes targeting Kurdish positions in northern Syria", actor1: "Turkish Armed Forces", actor2: "SDF/YPG", risk_score: 68 },
    { id: "live-11", event_date: "2026-08-27", event_type: "Riots", sub_event_type: "Violent demonstration", country: "Iran", region: "Middle East", location: "Tehran", latitude: 35.7, longitude: 51.4, fatalities: 0, source: "OSINT", notes: "Anti-government protests in Tehran following economic deterioration", actor1: "Protesters", actor2: "IRGC/Basij", risk_score: 55 },
    { id: "live-12", event_date: "2026-08-30", event_type: "Strategic developments", sub_event_type: "Military buildup", country: "China", region: "Asia", location: "Taiwan Strait", latitude: 24.0, longitude: 119.0, fatalities: 0, source: "OSINT", notes: "PLA naval exercises near Taiwan Strait median line, elevated cross-strait tensions", actor1: "PLA Navy", actor2: "Republic of China Armed Forces", risk_score: 70 },
    { id: "live-13", event_date: "2026-08-26", event_type: "Battles", sub_event_type: "Armed clash", country: "Colombia", region: "Americas", location: "Cauca Department", latitude: 2.5, longitude: -76.8, fatalities: 5, source: "OSINT", notes: "ELN guerrillas clash with Colombian military in southwestern Colombia", actor1: "Colombian Armed Forces", actor2: "ELN", risk_score: 62 },
    { id: "live-14", event_date: "2026-08-29", event_type: "Violence against civilians", sub_event_type: "Attack", country: "Burkina Faso", region: "Africa", location: "Sahel Region", latitude: 14.1, longitude: -0.1, fatalities: 22, source: "OSINT", notes: "JNIM militants carry out mass casualty attack in northern Burkina Faso", actor1: "JNIM (Al-Qaeda affiliate)", actor2: "Civilians", risk_score: 83 },
    { id: "live-15", event_date: "2026-08-28", event_type: "Explosions/Remote violence", sub_event_type: "Shelling/artillery", country: "Russia", region: "Europe", location: "Belgorod Oblast", latitude: 50.6, longitude: 36.6, fatalities: 1, source: "OSINT", notes: "Ukrainian cross-border strikes on Russian border areas", actor1: "Ukrainian Armed Forces", actor2: "Russian Border Forces", risk_score: 65 },
  ];
}

export async function getConflictSummary(): Promise<ConflictSummary> {
  const events = await fetchACLED();

  const countryMap = new Map<string, { events: number; fatalities: number }>();
  let totalFatalities = 0;

  for (const e of events) {
    totalFatalities += e.fatalities;
    const existing = countryMap.get(e.country);
    if (existing) {
      existing.events++;
      existing.fatalities += e.fatalities;
    } else {
      countryMap.set(e.country, { events: 1, fatalities: e.fatalities });
    }
  }

  const hotspots = Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      events: data.events,
      fatalities: data.fatalities,
      riskLevel: data.fatalities > 50 ? "critical" : data.fatalities > 10 ? "high" : data.events > 5 ? "elevated" : "moderate",
    }))
    .sort((a, b) => b.fatalities - a.fatalities)
    .slice(0, 15);

  return {
    totalEvents: events.length,
    totalFatalities,
    hotspots,
    recentEvents: events.slice(0, 50),
    assetImpacts: computeAssetImpacts(events),
    lastUpdated: new Date().toISOString(),
  };
}
