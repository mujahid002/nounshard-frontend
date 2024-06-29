// context/Store.jsx
import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState("");
  const [nativeBalance, setNativeBalance] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        userAddress,
        setUserAddress,
        nativeBalance,
        setNativeBalance,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
