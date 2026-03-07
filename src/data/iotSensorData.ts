// ─── IoT Vessel Sensor Data ───

export type SensorStatus = "normal" | "warning" | "critical";

export interface SensorPoint {
  id: string;
  name: string;
  description: string;
  component: string;
  status: SensorStatus;
  value: number;
  unit: string;
  threshold: { warning: number; critical: number };
}

export interface VesselSensors {
  vesselId: string;
  vesselName: string;
  fleet: string;
  imo: string;
  type: string;
  lastSync: string;
  connectionStatus: "online" | "offline" | "intermittent";
  alertCount: number;
  healthScore: number;
  sensors: SensorPoint[];
}

export interface Alert {
  id: string;
  sensorName: string;
  alertType: string;
  severity: SensorStatus;
  timestamp: string;
  vessel: string;
  message: string;
}

export interface TelemetryPoint {
  time: string;
  engineTemp: number;
  fuelConsumption: number;
  engineRPM: number;
  vibration: number;
  propellerRPM: number;
  thrusterPower: number;
}

// Generate time-series telemetry data with vessel-specific offsets
function generateTelemetry(hours: number, seed: number = 0): TelemetryPoint[] {
  const data: TelemetryPoint[] = [];
  const now = new Date();
  for (let i = hours * 4; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60000);
    const noise = () => (Math.random() - 0.5) * 2;
    const s = seed * 0.3;
    data.push({
      time: t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      engineTemp: 78 + s * 5 + Math.sin(i * 0.1 + s) * 8 + noise() * 3,
      fuelConsumption: 42 + s * 3 + Math.cos(i * 0.08 + s) * 5 + noise() * 2,
      engineRPM: 1450 + s * 30 + Math.sin(i * 0.15 + s) * 80 + noise() * 20,
      vibration: 2.1 + s * 0.3 + Math.sin(i * 0.2 + s) * 0.6 + noise() * 0.2,
      propellerRPM: 120 + s * 8 + Math.sin(i * 0.12 + s) * 15 + noise() * 5,
      thrusterPower: 65 + s * 5 + Math.cos(i * 0.1 + s) * 12 + noise() * 4,
    });
  }
  return data;
}

// Per-vessel telemetry
export function getVesselTelemetry(vesselIndex: number, hours: number): TelemetryPoint[] {
  const full = generateTelemetry(24, vesselIndex);
  if (hours === 1) return full.slice(-5);
  if (hours === 6) return full.slice(-25);
  return full;
}

// Sensor descriptions for non-technical users
const sensorDescriptions: Record<string, string> = {
  "Main Engine Temp": "How hot the main engine is running — higher means more strain",
  "Engine RPM": "How fast the engine is spinning — measured in revolutions per minute",
  "Oil Pressure": "Pressure of lubricating oil — low pressure can cause engine damage",
  "Fuel Level": "How much fuel remains in the tank as a percentage",
  "Fuel Flow Rate": "How quickly fuel is being consumed right now",
  "Propeller RPM": "Speed of the propeller — drives the vessel forward",
  "Thruster Power": "How much power the side thruster is using for maneuvering",
  "Exhaust Temp": "Temperature of exhaust gases — indicates combustion efficiency",
  "Coolant Temp": "Temperature of the engine cooling system fluid",
  "Vibration Level": "Amount of engine vibration — high vibration signals mechanical issues",
  "Hull Pressure": "Pressure on the hull — monitors structural integrity",
  "Ambient Temp": "Outside air temperature around the vessel",
};

function makeSensors(overrides: Partial<Record<string, { value: number; status: SensorStatus }>>): SensorPoint[] {
  const base: Omit<SensorPoint, "description">[] = [
    { id: "s1", name: "Main Engine Temp", component: "engine", status: "normal", value: 82, unit: "°C", threshold: { warning: 90, critical: 105 } },
    { id: "s2", name: "Engine RPM", component: "engine", status: "normal", value: 1480, unit: "RPM", threshold: { warning: 1800, critical: 2000 } },
    { id: "s3", name: "Oil Pressure", component: "engine", status: "normal", value: 4.1, unit: "bar", threshold: { warning: 3.5, critical: 2.5 } },
    { id: "s4", name: "Fuel Level", component: "fuel", status: "normal", value: 72, unit: "%", threshold: { warning: 30, critical: 15 } },
    { id: "s5", name: "Fuel Flow Rate", component: "fuel", status: "normal", value: 42.5, unit: "L/h", threshold: { warning: 55, critical: 65 } },
    { id: "s6", name: "Propeller RPM", component: "propeller", status: "normal", value: 125, unit: "RPM", threshold: { warning: 160, critical: 180 } },
    { id: "s7", name: "Thruster Power", component: "thruster", status: "normal", value: 68, unit: "%", threshold: { warning: 85, critical: 95 } },
    { id: "s8", name: "Exhaust Temp", component: "engine", status: "normal", value: 290, unit: "°C", threshold: { warning: 320, critical: 380 } },
    { id: "s9", name: "Coolant Temp", component: "engine", status: "normal", value: 65, unit: "°C", threshold: { warning: 80, critical: 95 } },
    { id: "s10", name: "Vibration Level", component: "vibration", status: "normal", value: 2.1, unit: "mm/s", threshold: { warning: 3.5, critical: 4.5 } },
    { id: "s11", name: "Hull Pressure", component: "pressure", status: "normal", value: 1.02, unit: "atm", threshold: { warning: 1.5, critical: 2.0 } },
    { id: "s12", name: "Ambient Temp", component: "temperature", status: "normal", value: 28, unit: "°C", threshold: { warning: 40, critical: 50 } },
  ];
  return base.map((s) => {
    const o = overrides[s.name];
    return { ...s, description: sensorDescriptions[s.name] || "", value: o?.value ?? s.value, status: o?.status ?? s.status };
  });
}

// All vessels sensor data
export const allVesselSensors: VesselSensors[] = [
  {
    vesselId: "v1", vesselName: "MT Kaveri", fleet: "Pacific", imo: "9876543", type: "Bulk Carrier",
    lastSync: new Date(Date.now() - 12000).toISOString(), connectionStatus: "online", alertCount: 3, healthScore: 74,
    sensors: makeSensors({
      "Oil Pressure": { value: 3.2, status: "warning" },
      "Exhaust Temp": { value: 340, status: "warning" },
      "Vibration Level": { value: 4.8, status: "critical" },
    }),
  },
  {
    vesselId: "v2", vesselName: "MV Godavari", fleet: "Pacific", imo: "9876544", type: "Container",
    lastSync: new Date(Date.now() - 30000).toISOString(), connectionStatus: "online", alertCount: 1, healthScore: 91,
    sensors: makeSensors({
      "Thruster Power": { value: 88, status: "warning" },
    }),
  },
  {
    vesselId: "v3", vesselName: "MV Narmada", fleet: "Atlantic", imo: "9876545", type: "AHTS",
    lastSync: new Date(Date.now() - 600000).toISOString(), connectionStatus: "intermittent", alertCount: 0, healthScore: 45,
    sensors: makeSensors({
      "Fuel Level": { value: 22, status: "warning" },
      "Engine RPM": { value: 0, status: "normal" },
    }),
  },
  {
    vesselId: "v4", vesselName: "MV Krishna", fleet: "Atlantic", imo: "9876546", type: "PSV",
    lastSync: new Date(Date.now() - 8000).toISOString(), connectionStatus: "online", alertCount: 2, healthScore: 82,
    sensors: makeSensors({
      "Main Engine Temp": { value: 94, status: "warning" },
      "Coolant Temp": { value: 82, status: "warning" },
    }),
  },
  {
    vesselId: "v5", vesselName: "MV Tapti", fleet: "Indian", imo: "9876547", type: "Bulk Carrier",
    lastSync: new Date(Date.now() - 15000).toISOString(), connectionStatus: "online", alertCount: 0, healthScore: 96,
    sensors: makeSensors({}),
  },
  {
    vesselId: "v6", vesselName: "MT Chambal", fleet: "Indian", imo: "9876548", type: "Tanker",
    lastSync: new Date(Date.now() - 900000).toISOString(), connectionStatus: "offline", alertCount: 4, healthScore: 58,
    sensors: makeSensors({
      "Main Engine Temp": { value: 102, status: "critical" },
      "Vibration Level": { value: 4.2, status: "warning" },
      "Oil Pressure": { value: 2.8, status: "critical" },
      "Fuel Level": { value: 18, status: "warning" },
    }),
  },
  {
    vesselId: "v7", vesselName: "MV Mahanadi", fleet: "Pacific", imo: "9876549", type: "Bulk Carrier",
    lastSync: new Date(Date.now() - 20000).toISOString(), connectionStatus: "online", alertCount: 1, healthScore: 88,
    sensors: makeSensors({
      "Exhaust Temp": { value: 325, status: "warning" },
    }),
  },
  {
    vesselId: "v8", vesselName: "MV Sabarmati", fleet: "Indian", imo: "9876550", type: "Bulk Carrier",
    lastSync: new Date(Date.now() - 5000).toISOString(), connectionStatus: "online", alertCount: 0, healthScore: 94,
    sensors: makeSensors({}),
  },
];

// Get fleet summary stats
export function getFleetIotSummary(fleet?: string) {
  const vessels = fleet ? allVesselSensors.filter(v => v.fleet === fleet) : allVesselSensors;
  const totalAlerts = vessels.reduce((s, v) => s + v.alertCount, 0);
  const online = vessels.filter(v => v.connectionStatus === "online").length;
  const avgHealth = Math.round(vessels.reduce((s, v) => s + v.healthScore, 0) / vessels.length);
  const criticalSensors = vessels.reduce((s, v) => s + v.sensors.filter(se => se.status === "critical").length, 0);
  const warningSensors = vessels.reduce((s, v) => s + v.sensors.filter(se => se.status === "warning").length, 0);
  return { totalVessels: vessels.length, totalAlerts, online, avgHealth, criticalSensors, warningSensors };
}

// KPI metrics for a specific vessel
export function getVesselKpiMetrics(vessel: VesselSensors) {
  const find = (name: string) => vessel.sensors.find(s => s.name === name);
  const fuel = find("Fuel Level");
  const rpm = find("Engine RPM");
  const temp = find("Main Engine Temp");
  const oil = find("Oil Pressure");
  const prop = find("Propeller RPM");
  const thrust = find("Thruster Power");
  const vib = find("Vibration Level");
  return [
    { label: "Fuel Level", description: "Remaining fuel in tank", value: fuel ? `${fuel.value}` : "N/A", unit: "%", status: fuel?.status || "normal" as SensorStatus },
    { label: "Engine RPM", description: "Engine rotation speed", value: rpm ? rpm.value.toLocaleString() : "N/A", unit: "RPM", status: rpm?.status || "normal" as SensorStatus },
    { label: "Engine Temp", description: "Main engine temperature", value: temp ? `${temp.value}` : "N/A", unit: "°C", status: temp?.status || "normal" as SensorStatus },
    { label: "Oil Pressure", description: "Lubricating oil pressure", value: oil ? `${oil.value}` : "N/A", unit: "bar", status: oil?.status || "normal" as SensorStatus },
    { label: "Propeller RPM", description: "Propeller rotation speed", value: prop ? `${prop.value}` : "N/A", unit: "RPM", status: prop?.status || "normal" as SensorStatus },
    { label: "Thruster Power", description: "Side thruster usage", value: thrust ? `${thrust.value}` : "N/A", unit: "%", status: thrust?.status || "normal" as SensorStatus },
    { label: "Vibration", description: "Engine vibration level", value: vib ? `${vib.value}` : "N/A", unit: "mm/s", status: vib?.status || "normal" as SensorStatus },
    { label: "Connection", description: "Data link status", value: vessel.connectionStatus === "online" ? "Online" : vessel.connectionStatus === "intermittent" ? "Unstable" : "Offline", unit: "", status: vessel.connectionStatus === "online" ? "normal" as SensorStatus : vessel.connectionStatus === "intermittent" ? "warning" as SensorStatus : "critical" as SensorStatus },
  ];
}

export const recentAlerts: Alert[] = [
  { id: "a1", sensorName: "Vibration Sensor", alertType: "Threshold Exceeded", severity: "critical", timestamp: new Date(Date.now() - 180000).toISOString(), vessel: "MT Kaveri", message: "Vibration level exceeded critical threshold (4.8 mm/s > 4.5 mm/s)" },
  { id: "a2", sensorName: "Main Engine Temp", alertType: "Overheating", severity: "critical", timestamp: new Date(Date.now() - 300000).toISOString(), vessel: "MT Chambal", message: "Engine temperature critically high (102°C > 105°C threshold)" },
  { id: "a3", sensorName: "Oil Pressure", alertType: "Low Pressure", severity: "critical", timestamp: new Date(Date.now() - 450000).toISOString(), vessel: "MT Chambal", message: "Oil pressure dangerously low (2.8 bar) — risk of engine damage" },
  { id: "a4", sensorName: "Exhaust Temperature", alertType: "High Temperature", severity: "warning", timestamp: new Date(Date.now() - 600000).toISOString(), vessel: "MT Kaveri", message: "Exhaust temperature above warning level (340°C > 320°C)" },
  { id: "a5", sensorName: "Oil Pressure", alertType: "Low Pressure", severity: "warning", timestamp: new Date(Date.now() - 1200000).toISOString(), vessel: "MT Kaveri", message: "Oil pressure approaching low threshold (3.2 bar < 3.5 bar)" },
  { id: "a6", sensorName: "Main Engine Temp", alertType: "High Temperature", severity: "warning", timestamp: new Date(Date.now() - 1800000).toISOString(), vessel: "MV Krishna", message: "Engine running warm (94°C) — monitor closely" },
  { id: "a7", sensorName: "Thruster Power", alertType: "Spike", severity: "warning", timestamp: new Date(Date.now() - 3600000).toISOString(), vessel: "MV Godavari", message: "Thruster power spike detected during maneuver (88%)" },
  { id: "a8", sensorName: "Fuel Level", alertType: "Low Fuel", severity: "warning", timestamp: new Date(Date.now() - 5400000).toISOString(), vessel: "MT Chambal", message: "Fuel level low (18%) — refueling recommended" },
  { id: "a9", sensorName: "Exhaust Temp", alertType: "Elevated", severity: "warning", timestamp: new Date(Date.now() - 7200000).toISOString(), vessel: "MV Mahanadi", message: "Exhaust temperature slightly elevated (325°C)" },
  { id: "a10", sensorName: "Connectivity", alertType: "Signal Lost", severity: "critical", timestamp: new Date(Date.now() - 900000).toISOString(), vessel: "MT Chambal", message: "Vessel data connection lost — last signal 15 min ago" },
];

// Helpers
export function getGaugeColor(status: SensorStatus): string {
  return status === "critical" ? "hsl(357, 96%, 46%)" : status === "warning" ? "hsl(38, 92%, 50%)" : "hsl(152, 55%, 42%)";
}

export function getStatusBg(status: SensorStatus): string {
  return status === "critical" ? "bg-destructive/15 border-destructive/30" : status === "warning" ? "bg-warning/15 border-warning/30" : "bg-success/15 border-success/30";
}

export function getStatusText(status: SensorStatus): string {
  return status === "critical" ? "text-destructive" : status === "warning" ? "text-warning" : "text-success";
}

export function getHealthColor(score: number): string {
  if (score >= 85) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

export function getHealthLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "Critical";
}

export const fleetOptions = ["All Fleets", "Pacific", "Atlantic", "Indian"] as const;
