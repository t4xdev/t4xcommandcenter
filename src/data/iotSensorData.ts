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
  // New sensors
  "Turbocharger RPM": "Speed of turbocharger — boosts engine power output",
  "Turbocharger Temp": "Exhaust side temperature of the turbocharger",
  "Fuel Viscosity": "Thickness of fuel — affects combustion quality",
  "Fuel Temp": "Temperature of fuel before injection — affects flow rate",
  "Aux Engine 1 Temp": "Temperature of auxiliary engine #1 — powers onboard systems",
  "Aux Engine 2 Temp": "Temperature of auxiliary engine #2 — backup power",
  "Aux Engine 1 RPM": "Rotation speed of auxiliary engine #1",
  "Generator Load": "How much electrical load the generator is carrying",
  "Generator Voltage": "Voltage output of the main generator",
  "Generator Frequency": "Frequency of generator output — should be steady at 60Hz",
  "Steering Gear Pressure": "Hydraulic pressure in steering system — critical for navigation",
  "Rudder Angle": "Current position of the rudder in degrees",
  "Ballast Tank Level": "Water level in ballast tanks — affects vessel stability",
  "Bilge Level": "Water level in the bilge — high levels indicate leakage",
  "Fresh Water Level": "Remaining fresh water supply for crew and operations",
  "Sea Water Temp": "Temperature of surrounding sea water",
  "Cargo Hold Temp": "Temperature inside cargo hold — important for sensitive cargo",
  "Cargo Hold Humidity": "Moisture level in cargo hold — prevents cargo damage",
  "Wind Speed": "Current wind speed at vessel location",
  "Wind Direction": "Direction wind is coming from — affects vessel handling",
  "GPS Speed": "Vessel speed over ground from GPS",
  "GPS Heading": "Vessel compass heading from GPS navigation",
  "Bow Thruster Power": "Power usage of the forward thruster",
  "Stern Tube Temp": "Temperature of stern tube bearing — protects propeller shaft",
  "Shaft Power": "Total power transmitted through the propeller shaft",
  "Inclinometer Roll": "Vessel roll angle — monitors stability",
  "Inclinometer Pitch": "Vessel pitch angle — monitors fore/aft tilt",
  "Air Compressor Pressure": "Compressed air system pressure — used for engine starting",
  "Boiler Steam Pressure": "Steam pressure in the boiler — powers heating systems",
  "Boiler Water Temp": "Water temperature inside the boiler",
  "Fire Detection Zone 1": "Fire/smoke detection status in engine room",
  "Fire Detection Zone 2": "Fire/smoke detection status in cargo area",
  "CO2 Level Engine Room": "Carbon dioxide concentration in engine room",
  "O2 Level Engine Room": "Oxygen level in engine room — safety monitoring",
};

function makeSensors(overrides: Partial<Record<string, { value: number; status: SensorStatus }>>): SensorPoint[] {
  const base: Omit<SensorPoint, "description">[] = [
    // Engine
    { id: "s1", name: "Main Engine Temp", component: "engine", status: "normal", value: 82, unit: "°C", threshold: { warning: 90, critical: 105 } },
    { id: "s2", name: "Engine RPM", component: "engine", status: "normal", value: 1480, unit: "RPM", threshold: { warning: 1800, critical: 2000 } },
    { id: "s3", name: "Oil Pressure", component: "engine", status: "normal", value: 4.1, unit: "bar", threshold: { warning: 3.5, critical: 2.5 } },
    { id: "s8", name: "Exhaust Temp", component: "engine", status: "normal", value: 290, unit: "°C", threshold: { warning: 320, critical: 380 } },
    { id: "s9", name: "Coolant Temp", component: "engine", status: "normal", value: 65, unit: "°C", threshold: { warning: 80, critical: 95 } },
    { id: "s13", name: "Turbocharger RPM", component: "engine", status: "normal", value: 18500, unit: "RPM", threshold: { warning: 22000, critical: 25000 } },
    { id: "s14", name: "Turbocharger Temp", component: "engine", status: "normal", value: 520, unit: "°C", threshold: { warning: 580, critical: 650 } },
    // Fuel
    { id: "s4", name: "Fuel Level", component: "fuel", status: "normal", value: 72, unit: "%", threshold: { warning: 30, critical: 15 } },
    { id: "s5", name: "Fuel Flow Rate", component: "fuel", status: "normal", value: 42.5, unit: "L/h", threshold: { warning: 55, critical: 65 } },
    { id: "s15", name: "Fuel Viscosity", component: "fuel", status: "normal", value: 12.5, unit: "cSt", threshold: { warning: 18, critical: 22 } },
    { id: "s16", name: "Fuel Temp", component: "fuel", status: "normal", value: 98, unit: "°C", threshold: { warning: 120, critical: 140 } },
    // Propulsion
    { id: "s6", name: "Propeller RPM", component: "propeller", status: "normal", value: 125, unit: "RPM", threshold: { warning: 160, critical: 180 } },
    { id: "s30", name: "Stern Tube Temp", component: "propeller", status: "normal", value: 42, unit: "°C", threshold: { warning: 55, critical: 70 } },
    { id: "s31", name: "Shaft Power", component: "propeller", status: "normal", value: 4200, unit: "kW", threshold: { warning: 5500, critical: 6500 } },
    // Thruster
    { id: "s7", name: "Thruster Power", component: "thruster", status: "normal", value: 68, unit: "%", threshold: { warning: 85, critical: 95 } },
    { id: "s29", name: "Bow Thruster Power", component: "thruster", status: "normal", value: 45, unit: "%", threshold: { warning: 85, critical: 95 } },
    // Auxiliary engines & electrical
    { id: "s17", name: "Aux Engine 1 Temp", component: "auxiliary", status: "normal", value: 75, unit: "°C", threshold: { warning: 88, critical: 100 } },
    { id: "s18", name: "Aux Engine 2 Temp", component: "auxiliary", status: "normal", value: 72, unit: "°C", threshold: { warning: 88, critical: 100 } },
    { id: "s19", name: "Aux Engine 1 RPM", component: "auxiliary", status: "normal", value: 720, unit: "RPM", threshold: { warning: 900, critical: 1000 } },
    { id: "s20", name: "Generator Load", component: "electrical", status: "normal", value: 65, unit: "%", threshold: { warning: 85, critical: 95 } },
    { id: "s21", name: "Generator Voltage", component: "electrical", status: "normal", value: 440, unit: "V", threshold: { warning: 460, critical: 480 } },
    { id: "s22", name: "Generator Frequency", component: "electrical", status: "normal", value: 60, unit: "Hz", threshold: { warning: 62, critical: 64 } },
    // Steering
    { id: "s23", name: "Steering Gear Pressure", component: "steering", status: "normal", value: 120, unit: "bar", threshold: { warning: 150, critical: 175 } },
    { id: "s24", name: "Rudder Angle", component: "steering", status: "normal", value: 2, unit: "°", threshold: { warning: 30, critical: 35 } },
    // Tanks & levels
    { id: "s25", name: "Ballast Tank Level", component: "tanks", status: "normal", value: 55, unit: "%", threshold: { warning: 85, critical: 95 } },
    { id: "s26", name: "Bilge Level", component: "tanks", status: "normal", value: 12, unit: "%", threshold: { warning: 40, critical: 60 } },
    { id: "s27", name: "Fresh Water Level", component: "tanks", status: "normal", value: 68, unit: "%", threshold: { warning: 25, critical: 10 } },
    // Vibration
    { id: "s10", name: "Vibration Level", component: "vibration", status: "normal", value: 2.1, unit: "mm/s", threshold: { warning: 3.5, critical: 4.5 } },
    // Pressure
    { id: "s11", name: "Hull Pressure", component: "pressure", status: "normal", value: 1.02, unit: "atm", threshold: { warning: 1.5, critical: 2.0 } },
    { id: "s35", name: "Air Compressor Pressure", component: "pressure", status: "normal", value: 28, unit: "bar", threshold: { warning: 32, critical: 35 } },
    // Environmental & weather
    { id: "s12", name: "Ambient Temp", component: "environment", status: "normal", value: 28, unit: "°C", threshold: { warning: 40, critical: 50 } },
    { id: "s28", name: "Sea Water Temp", component: "environment", status: "normal", value: 26, unit: "°C", threshold: { warning: 32, critical: 36 } },
    { id: "s33", name: "Wind Speed", component: "environment", status: "normal", value: 18, unit: "kn", threshold: { warning: 35, critical: 50 } },
    { id: "s34", name: "Wind Direction", component: "environment", status: "normal", value: 225, unit: "°", threshold: { warning: 999, critical: 999 } },
    // Cargo
    { id: "s36", name: "Cargo Hold Temp", component: "cargo", status: "normal", value: 22, unit: "°C", threshold: { warning: 30, critical: 38 } },
    { id: "s37", name: "Cargo Hold Humidity", component: "cargo", status: "normal", value: 55, unit: "%", threshold: { warning: 75, critical: 85 } },
    // Navigation
    { id: "s38", name: "GPS Speed", component: "navigation", status: "normal", value: 12.4, unit: "kn", threshold: { warning: 18, critical: 22 } },
    { id: "s39", name: "GPS Heading", component: "navigation", status: "normal", value: 142, unit: "°", threshold: { warning: 999, critical: 999 } },
    { id: "s32", name: "Inclinometer Roll", component: "navigation", status: "normal", value: 1.2, unit: "°", threshold: { warning: 15, critical: 25 } },
    { id: "s40", name: "Inclinometer Pitch", component: "navigation", status: "normal", value: 0.8, unit: "°", threshold: { warning: 10, critical: 20 } },
    // Boiler & safety
    { id: "s41", name: "Boiler Steam Pressure", component: "boiler", status: "normal", value: 7.5, unit: "bar", threshold: { warning: 9, critical: 10.5 } },
    { id: "s42", name: "Boiler Water Temp", component: "boiler", status: "normal", value: 165, unit: "°C", threshold: { warning: 180, critical: 200 } },
    { id: "s43", name: "Fire Detection Zone 1", component: "safety", status: "normal", value: 0, unit: "", threshold: { warning: 1, critical: 1 } },
    { id: "s44", name: "Fire Detection Zone 2", component: "safety", status: "normal", value: 0, unit: "", threshold: { warning: 1, critical: 1 } },
    { id: "s45", name: "CO2 Level Engine Room", component: "safety", status: "normal", value: 450, unit: "ppm", threshold: { warning: 1000, critical: 2000 } },
    { id: "s46", name: "O2 Level Engine Room", component: "safety", status: "normal", value: 20.8, unit: "%", threshold: { warning: 19.5, critical: 18 } },
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

// ─── Executive Charts Data ───

// Health progression over 7 days
export const healthProgressionData = [
  { day: "Mon", Pacific: 88, Atlantic: 72, Indian: 82, fleet: 81 },
  { day: "Tue", Pacific: 86, Atlantic: 74, Indian: 84, fleet: 82 },
  { day: "Wed", Pacific: 90, Atlantic: 70, Indian: 80, fleet: 80 },
  { day: "Thu", Pacific: 85, Atlantic: 68, Indian: 86, fleet: 80 },
  { day: "Fri", Pacific: 88, Atlantic: 75, Indian: 88, fleet: 84 },
  { day: "Sat", Pacific: 91, Atlantic: 64, Indian: 85, fleet: 80 },
  { day: "Today", Pacific: 91, Atlantic: 64, Indian: 82, fleet: 79 },
];

// Sensor status distribution across fleet
export function getSensorStatusDistribution(fleet?: string) {
  const vessels = fleet ? allVesselSensors.filter(v => v.fleet === fleet) : allVesselSensors;
  let normal = 0, warning = 0, critical = 0;
  vessels.forEach(v => v.sensors.forEach(s => {
    if (s.status === "normal") normal++;
    else if (s.status === "warning") warning++;
    else critical++;
  }));
  return [
    { name: "Normal", value: normal, fill: "hsl(152, 55%, 42%)" },
    { name: "Warning", value: warning, fill: "hsl(38, 92%, 50%)" },
    { name: "Critical", value: critical, fill: "hsl(357, 96%, 46%)" },
  ];
}

// Alerts by category (pie chart)
export function getAlertsByCategory(fleet?: string) {
  const vesselNames = fleet ? new Set(allVesselSensors.filter(v => v.fleet === fleet).map(v => v.vesselName)) : null;
  const alerts = vesselNames ? recentAlerts.filter(a => vesselNames.has(a.vessel)) : recentAlerts;
  const cats: Record<string, number> = {};
  alerts.forEach(a => { cats[a.alertType] = (cats[a.alertType] || 0) + 1; });
  const colors = ["hsl(357, 96%, 46%)", "hsl(38, 92%, 50%)", "hsl(210, 80%, 52%)", "hsl(152, 55%, 42%)", "hsl(280, 60%, 55%)", "hsl(15, 80%, 55%)"];
  return Object.entries(cats).map(([name, value], i) => ({ name, value, fill: colors[i % colors.length] }));
}

// Fleet-wise health comparison (bar chart)
export function getFleetHealthComparison() {
  const fleets = ["Pacific", "Atlantic", "Indian"];
  return fleets.map(f => {
    const vessels = allVesselSensors.filter(v => v.fleet === f);
    const avg = Math.round(vessels.reduce((s, v) => s + v.healthScore, 0) / vessels.length);
    const alerts = vessels.reduce((s, v) => s + v.alertCount, 0);
    const online = vessels.filter(v => v.connectionStatus === "online").length;
    return { fleet: f, health: avg, alerts, online, vessels: vessels.length };
  });
}

// Vessel health bar chart
export function getVesselHealthBars(fleet?: string) {
  const vessels = fleet ? allVesselSensors.filter(v => v.fleet === fleet) : allVesselSensors;
  return vessels.map(v => ({
    vessel: v.vesselName.replace(/^(MT|MV)\s/, ""),
    health: v.healthScore,
    alerts: v.alertCount,
    fill: v.healthScore >= 85 ? "hsl(152, 55%, 42%)" : v.healthScore >= 60 ? "hsl(38, 92%, 50%)" : "hsl(357, 96%, 46%)",
  }));
}

// Component health breakdown (donut)
export function getComponentHealthBreakdown(fleet?: string) {
  const vessels = fleet ? allVesselSensors.filter(v => v.fleet === fleet) : allVesselSensors;
  const components: Record<string, { total: number; issues: number }> = {};
  vessels.forEach(v => v.sensors.forEach(s => {
    if (!components[s.component]) components[s.component] = { total: 0, issues: 0 };
    components[s.component].total++;
    if (s.status !== "normal") components[s.component].issues++;
  }));
  const colors: Record<string, string> = {
    engine: "hsl(357, 96%, 46%)", fuel: "hsl(210, 80%, 52%)", propeller: "hsl(152, 55%, 42%)",
    thruster: "hsl(38, 92%, 50%)", vibration: "hsl(280, 60%, 55%)", pressure: "hsl(215, 50%, 23%)",
    temperature: "hsl(15, 80%, 55%)",
  };
  return Object.entries(components).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    healthy: data.total - data.issues,
    issues: data.issues,
    total: data.total,
    fill: colors[name] || "hsl(216, 10%, 46%)",
  }));
}

// Monthly progression data
export const monthlyProgressionData = [
  { month: "Oct", health: 76, alerts: 18, uptime: 91 },
  { month: "Nov", health: 79, alerts: 14, uptime: 93 },
  { month: "Dec", health: 74, alerts: 22, uptime: 88 },
  { month: "Jan", health: 81, alerts: 12, uptime: 94 },
  { month: "Feb", health: 83, alerts: 9, uptime: 96 },
  { month: "Mar", health: 79, alerts: 11, uptime: 95 },
];
