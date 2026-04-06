import { createContext, useContext, useState, type ReactNode } from "react";
import { fleets, type FleetName } from "@/data/maritimeData";

interface FleetContextType {
  selectedFleet: FleetName;
  setSelectedFleet: (fleet: FleetName) => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export function FleetProvider({ children }: { children: ReactNode }) {
  const [selectedFleet, setSelectedFleet] = useState<FleetName>(() => {
    const named = fleets.filter(f => f !== "All Fleets");
    return named[Math.floor(Math.random() * named.length)];
  });

  return (
    <FleetContext.Provider value={{ selectedFleet, setSelectedFleet }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error("useFleet must be used within FleetProvider");
  return ctx;
}
