import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DataSaverContextType {
  dataSaverEnabled: boolean;
  toggleDataSaver: () => void;
}

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

const DATA_SAVER_KEY = "intern-us-data-saver";

export function DataSaverProvider({ children }: { children: ReactNode }) {
  const [dataSaverEnabled, setDataSaverEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(DATA_SAVER_KEY);
      return stored === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(DATA_SAVER_KEY, String(dataSaverEnabled));
    
    // Apply data saver class to root for CSS-based optimizations
    if (dataSaverEnabled) {
      document.documentElement.classList.add("data-saver");
    } else {
      document.documentElement.classList.remove("data-saver");
    }
  }, [dataSaverEnabled]);

  const toggleDataSaver = () => setDataSaverEnabled(prev => !prev);

  return (
    <DataSaverContext.Provider value={{ dataSaverEnabled, toggleDataSaver }}>
      {children}
    </DataSaverContext.Provider>
  );
}

export function useDataSaver() {
  const context = useContext(DataSaverContext);
  if (!context) {
    throw new Error("useDataSaver must be used within a DataSaverProvider");
  }
  return context;
}
