export interface CyberAttackArc {
  id: string;
  sourceCountry: string;
  sourceCity: string;
  sourceCoords: [number, number]; // [lat, lng]
  sourceFlag: string;
  targetCountry: string;
  targetCity: string;
  targetCoords: [number, number]; // [lat, lng]
  targetFlag: string;
  aptActor: string;
  threatGroupAlias: string;
  attackVector: 'SCADA_GRID_INTRUSION' | 'DDOS_BOTNET_SURGE' | 'RANSOMWARE_ENCRYPTION' | 'ZERO_DAY_EXPLOIT' | 'BGP_ROUTE_HIJACK' | 'SATELLITE_LINK_JAMMING';
  targetSector: 'ENERGY_GRID' | 'FINANCIAL_SWIFT' | 'DEFENSE_COMMAND' | 'SUBSEA_TELECOM' | 'NUCLEAR_FACILITY' | 'GOV_DATA_CENTER';
  volumeGbps?: number;
  severity: 'CRITICAL' | 'HIGH' | 'EXTREME';
  mitreTactic: string;
  cveIdentifier?: string;
  status: 'ACTIVE_INTERCEPTION' | 'PAYLOAD_DETONATION' | 'FIREWALL_BLOCKED';
  liveDescription: string;
}

export interface CyberDefenseNode {
  id: string;
  name: string;
  country: string;
  coords: [number, number];
  type: 'SUBSEA_CABLE_HUB' | 'SOVEREIGN_SOC' | 'INTERNET_EXCHANGE' | 'NUCLEAR_SCADA_NODE';
  status: 'DEFENDING' | 'UNDER_ATTACK' | 'COMPROMISED' | 'OPERATIONAL';
  trafficVolumeTbps: number;
  activeMitigations: number;
}

export const ACTIVE_CYBER_ATTACK_ARCS: CyberAttackArc[] = [
  {
    id: 'cyber-arc-01',
    sourceCountry: 'Russia',
    sourceCity: 'Moscow',
    sourceCoords: [55.7558, 37.6173],
    sourceFlag: '🇷🇺',
    targetCountry: 'Ukraine',
    targetCity: 'Kyiv',
    targetCoords: [50.4501, 30.5234],
    targetFlag: '🇺🇦',
    aptActor: 'Sandworm / GRU Unit 74455',
    threatGroupAlias: 'Electrum / TeleBots',
    attackVector: 'SCADA_GRID_INTRUSION',
    targetSector: 'ENERGY_GRID',
    severity: 'EXTREME',
    mitreTactic: 'T0814 (Denial of Control - IEC 60870-5 SCADA)',
    cveIdentifier: 'CVE-2024-38077',
    status: 'ACTIVE_INTERCEPTION',
    liveDescription: 'Automated malware deployment attempting to trip circuit breakers across regional electrical substations in western power distribution corridors.',
  },
  {
    id: 'cyber-arc-02',
    sourceCountry: 'China',
    sourceCity: 'Hainan',
    sourceCoords: [20.0440, 110.3340],
    sourceFlag: '🇨🇳',
    targetCountry: 'United States',
    targetCity: 'Guam / Washington D.C.',
    targetCoords: [13.4443, 144.7937],
    targetFlag: '🇺🇸',
    aptActor: 'Volt Typhoon / Vanguard Panda',
    threatGroupAlias: 'BRONZE SILHOUETTE',
    attackVector: 'ZERO_DAY_EXPLOIT',
    targetSector: 'DEFENSE_COMMAND',
    severity: 'EXTREME',
    mitreTactic: 'T1078 (Living off the Land / Valid Accounts Persistence)',
    cveIdentifier: 'CVE-2024-21887',
    status: 'ACTIVE_INTERCEPTION',
    liveDescription: 'Pre-positioning zero-day credentials inside Pacific defense logistics networks and maritime port management software.',
  },
  {
    id: 'cyber-arc-03',
    sourceCountry: 'North Korea',
    sourceCity: 'Pyongyang',
    sourceCoords: [39.0392, 125.7625],
    sourceFlag: '🇰🇵',
    targetCountry: 'United States',
    targetCity: 'New York (Wall Street)',
    targetCoords: [40.7128, -74.0060],
    targetFlag: '🇺🇸',
    aptActor: 'Lazarus Group / RGB Lab 110',
    threatGroupAlias: 'HIDDEN COBRA / TraderTraitor',
    attackVector: 'RANSOMWARE_ENCRYPTION',
    targetSector: 'FINANCIAL_SWIFT',
    severity: 'CRITICAL',
    mitreTactic: 'T1195 (Supply Chain Compromise - Decentralized Bridge Exploits)',
    cveIdentifier: 'CVE-2024-4577',
    status: 'FIREWALL_BLOCKED',
    liveDescription: 'State-sponsored crypto theft & SWIFT rail spoofing targeting multi-asset settlement liquidity protocols.',
  },
  {
    id: 'cyber-arc-04',
    sourceCountry: 'Iran',
    sourceCity: 'Tehran',
    sourceCoords: [35.6892, 51.3890],
    sourceFlag: '🇮🇷',
    targetCountry: 'Israel',
    targetCity: 'Tel Aviv',
    targetCoords: [32.0853, 34.7818],
    targetFlag: '🇮🇱',
    aptActor: 'Charming Kitten / APT35 / Mint Sandstorm',
    threatGroupAlias: 'PHOSPHORUS',
    attackVector: 'DDOS_BOTNET_SURGE',
    targetSector: 'GOV_DATA_CENTER',
    volumeGbps: 850,
    severity: 'HIGH',
    mitreTactic: 'T1498 (Network Denial of Service - DNS Amplification)',
    status: 'ACTIVE_INTERCEPTION',
    liveDescription: 'High-volume distributed denial-of-service barrage overwhelming national emergency alert dispatch servers and civil warning portals.',
  },
  {
    id: 'cyber-arc-05',
    sourceCountry: 'Russia',
    sourceCity: 'St. Petersburg',
    sourceCoords: [59.9343, 30.3351],
    sourceFlag: '🇷🇺',
    targetCountry: 'United Kingdom',
    targetCity: 'London (Slough IX)',
    targetCoords: [51.5074, -0.1278],
    targetFlag: '🇬🇧',
    aptActor: 'Fancy Bear / APT28 / GRU Unit 26165',
    threatGroupAlias: 'STRONTIUM / Sofacy',
    attackVector: 'BGP_ROUTE_HIJACK',
    targetSector: 'SUBSEA_TELECOM',
    severity: 'CRITICAL',
    mitreTactic: 'T1557 (Adversary-in-the-Middle - Autonomous System Routing Leaks)',
    status: 'ACTIVE_INTERCEPTION',
    liveDescription: 'Autonomous System route announcement spoofing attempting to intercept and decrypt high-frequency transatlantic financial traffic.',
  },
  {
    id: 'cyber-arc-06',
    sourceCountry: 'China',
    sourceCity: 'Chengdu',
    sourceCoords: [30.5728, 104.0668],
    sourceFlag: '🇨🇳',
    targetCountry: 'Taiwan',
    targetCity: 'Hsinchu Science Park',
    targetCoords: [24.7820, 120.9970],
    targetFlag: '🇹🇼',
    aptActor: 'APT41 / Double Dragon',
    threatGroupAlias: 'BARIUM / WICKED PANDA',
    attackVector: 'ZERO_DAY_EXPLOIT',
    targetSector: 'DEFENSE_COMMAND',
    severity: 'EXTREME',
    mitreTactic: 'T1005 (Data from Local System - Semiconductor Mask IP Exfiltration)',
    cveIdentifier: 'CVE-2024-6387',
    status: 'ACTIVE_INTERCEPTION',
    liveDescription: 'Targeted spear-phishing and hardware firmware intrusion into advanced 3nm EUV lithography cleanroom telemetry systems.',
  }
];

export const CYBER_DEFENSE_NODES: CyberDefenseNode[] = [
  {
    id: 'node-slough-ldn',
    name: 'Slough Telehouse Internet Exchange',
    country: 'United Kingdom',
    coords: [51.5100, -0.5900],
    type: 'INTERNET_EXCHANGE',
    status: 'UNDER_ATTACK',
    trafficVolumeTbps: 18.4,
    activeMitigations: 42,
  },
  {
    id: 'node-de-cix-fra',
    name: 'DE-CIX Frankfurt (Global Backbone Node)',
    country: 'Germany',
    coords: [50.1109, 8.6821],
    type: 'INTERNET_EXCHANGE',
    status: 'DEFENDING',
    trafficVolumeTbps: 34.2,
    activeMitigations: 89,
  },
  {
    id: 'node-sovereign-nur',
    name: 'Nur Cyber Command Sovereign SOC',
    country: 'Global Starship Bridge',
    coords: [39.9334, 32.8597],
    type: 'SOVEREIGN_SOC',
    status: 'OPERATIONAL',
    trafficVolumeTbps: 50.0,
    activeMitigations: 128,
  },
  {
    id: 'node-red-sea-cable',
    name: 'Red Sea Subsea Cable Landing (Djibouti / Suez)',
    country: 'Djibouti / Egypt',
    coords: [11.8251, 42.5903],
    type: 'SUBSEA_CABLE_HUB',
    status: 'UNDER_ATTACK',
    trafficVolumeTbps: 45.0,
    activeMitigations: 15,
  }
];
