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
  const year = new Date().getFullYear();
  try {
    const res = await fetch(
      `https://ucdpapi.pcr.uu.se/api/gedevents/${year}?pagesize=${Math.min(limit, 100)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`UCDP ${res.status}`);
    const json = await res.json();
    const items = json?.Result || [];

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
    return [];
  }
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
