// ─── IoT Vessel Sensor Data ───

export type SensorStatus = "normal" | "warning" | "critical";

export interface SensorPoint {
  id: string;
  name: string;
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
  lastSync: string;
  connectionStatus: "online" | "offline" | "intermittent";
  alertCount: number;
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

// Generate time-series telemetry data
function generateTelemetry(hours: number): TelemetryPoint[] {
  const data: TelemetryPoint[] = [];
  const now = new Date();
  for (let i = hours * 4; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60000);
    const noise = () => (Math.random() - 0.5) * 2;
    data.push({
      time: t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      engineTemp: 78 + Math.sin(i * 0.1) * 8 + noise() * 3,
      fuelConsumption: 42 + Math.cos(i * 0.08) * 5 + noise() * 2,
      engineRPM: 1450 + Math.sin(i * 0.15) * 80 + noise() * 20,
      vibration: 2.1 + Math.sin(i * 0.2) * 0.6 + noise() * 0.2,
      propellerRPM: 120 + Math.sin(i * 0.12) * 15 + noise() * 5,
      thrusterPower: 65 + Math.cos(i * 0.1) * 12 + noise() * 4,
    });
  }
  return data;
}

export const telemetryData24h = generateTelemetry(24);
export const telemetryData6h = telemetryData24h.slice(-25);
export const telemetryData1h = telemetryData24h.slice(-5);

// Fuel consumption trend (24h)
export const fuelTrendData = telemetryData24h.map((d) => ({
  time: d.time,
  consumption: Math.round(d.fuelConsumption * 10) / 10,
  efficiency: Math.round((100 - d.fuelConsumption / 0.55) * 10) / 10,
}));

export const vesselSensorData: VesselSensors = {
  vesselId: "v1",
  vesselName: "MT Kaveri",
  fleet: "Pacific",
  imo: "9876543",
  lastSync: new Date(Date.now() - 12000).toISOString(),
  connectionStatus: "online",
  alertCount: 3,
  sensors: [
    { id: "s1", name: "Main Engine Temp", component: "engine", status: "normal", value: 82, unit: "°C", threshold: { warning: 90, critical: 105 } },
    { id: "s2", name: "Engine RPM", component: "engine", status: "normal", value: 1480, unit: "RPM", threshold: { warning: 1800, critical: 2000 } },
    { id: "s3", name: "Oil Pressure", component: "engine", status: "warning", value: 3.2, unit: "bar", threshold: { warning: 3.5, critical: 2.5 } },
    { id: "s4", name: "Fuel Level", component: "fuel", status: "normal", value: 72, unit: "%", threshold: { warning: 30, critical: 15 } },
    { id: "s5", name: "Fuel Flow Rate", component: "fuel", status: "normal", value: 42.5, unit: "L/h", threshold: { warning: 55, critical: 65 } },
    { id: "s6", name: "Propeller RPM", component: "propeller", status: "normal", value: 125, unit: "RPM", threshold: { warning: 160, critical: 180 } },
    { id: "s7", name: "Thruster Power", component: "thruster", status: "normal", value: 68, unit: "%", threshold: { warning: 85, critical: 95 } },
    { id: "s8", name: "Exhaust Temp", component: "engine", status: "warning", value: 340, unit: "°C", threshold: { warning: 320, critical: 380 } },
    { id: "s9", name: "Coolant Temp", component: "engine", status: "normal", value: 65, unit: "°C", threshold: { warning: 80, critical: 95 } },
    { id: "s10", name: "Vibration Level", component: "vibration", status: "critical", value: 4.8, unit: "mm/s", threshold: { warning: 3.5, critical: 4.5 } },
    { id: "s11", name: "Hull Pressure", component: "pressure", status: "normal", value: 1.02, unit: "atm", threshold: { warning: 1.5, critical: 2.0 } },
    { id: "s12", name: "Ambient Temp", component: "temperature", status: "normal", value: 28, unit: "°C", threshold: { warning: 40, critical: 50 } },
  ],
};

export const kpiMetrics = [
  { label: "Fuel Level", value: "72", unit: "%", icon: "fuel", status: "normal" as SensorStatus },
  { label: "Engine RPM", value: "1,480", unit: "RPM", icon: "engine", status: "normal" as SensorStatus },
  { label: "Engine Temp", value: "82", unit: "°C", icon: "temp", status: "normal" as SensorStatus },
  { label: "Oil Pressure", value: "3.2", unit: "bar", icon: "pressure", status: "warning" as SensorStatus },
  { label: "Propeller RPM", value: "125", unit: "RPM", icon: "propeller", status: "normal" as SensorStatus },
  { label: "Thruster Power", value: "68", unit: "%", icon: "thruster", status: "normal" as SensorStatus },
  { label: "Vibration", value: "4.8", unit: "mm/s", icon: "vibration", status: "critical" as SensorStatus },
  { label: "Connectivity", value: "Online", unit: "", icon: "connection", status: "normal" as SensorStatus },
];

export const recentAlerts: Alert[] = [
  { id: "a1", sensorName: "Vibration Sensor", alertType: "Threshold Exceeded", severity: "critical", timestamp: new Date(Date.now() - 180000).toISOString(), vessel: "MT Kaveri", message: "Vibration level exceeded critical threshold (4.8 mm/s > 4.5 mm/s)" },
  { id: "a2", sensorName: "Exhaust Temperature", alertType: "High Temperature", severity: "warning", timestamp: new Date(Date.now() - 600000).toISOString(), vessel: "MT Kaveri", message: "Exhaust temperature above warning level (340°C > 320°C)" },
  { id: "a3", sensorName: "Oil Pressure", alertType: "Low Pressure", severity: "warning", timestamp: new Date(Date.now() - 1200000).toISOString(), vessel: "MT Kaveri", message: "Oil pressure approaching low threshold (3.2 bar < 3.5 bar)" },
  { id: "a4", sensorName: "Fuel Level", alertType: "Level Drop", severity: "normal", timestamp: new Date(Date.now() - 3600000).toISOString(), vessel: "MT Kaveri", message: "Fuel consumption rate slightly elevated" },
  { id: "a5", sensorName: "Engine RPM", alertType: "Fluctuation", severity: "normal", timestamp: new Date(Date.now() - 5400000).toISOString(), vessel: "MT Kaveri", message: "Minor RPM fluctuation detected during speed change" },
  { id: "a6", sensorName: "Thruster Power", alertType: "Spike", severity: "warning", timestamp: new Date(Date.now() - 7200000).toISOString(), vessel: "MV Godavari", message: "Thruster power spike detected during maneuver" },
];

// Gauge helper
export function getGaugeColor(status: SensorStatus): string {
  return status === "critical" ? "hsl(357, 96%, 46%)" : status === "warning" ? "hsl(38, 92%, 50%)" : "hsl(152, 55%, 42%)";
}

export function getStatusBg(status: SensorStatus): string {
  return status === "critical" ? "bg-destructive/15 border-destructive/30" : status === "warning" ? "bg-warning/15 border-warning/30" : "bg-success/15 border-success/30";
}

export function getStatusText(status: SensorStatus): string {
  return status === "critical" ? "text-destructive" : status === "warning" ? "text-warning" : "text-success";
}
