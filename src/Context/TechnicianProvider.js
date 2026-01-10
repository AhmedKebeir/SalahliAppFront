import { createContext, useContext, useState } from "react";

// إنشاء الكونتكست
const TechnicianContext = createContext();

// Provider
export function TechnicianProvider({ children }) {
  const [technicianId, setTechnicianId] = useState(null);

  return (
    <TechnicianContext.Provider value={{ technicianId, setTechnicianId }}>
      {children}
    </TechnicianContext.Provider>
  );
}

// custom hook
export function useTechnician() {
  return useContext(TechnicianContext);
}
