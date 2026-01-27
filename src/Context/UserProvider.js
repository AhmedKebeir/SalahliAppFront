import { createContext, useContext, useState } from "react";

// إنشاء الكونتكست
const UserContext = createContext();

// Provider
export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

// custom hook
export function useUser() {
  return useContext(UserContext);
}
