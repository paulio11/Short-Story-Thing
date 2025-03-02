import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const defaultSettings = JSON.parse(localStorage.getItem("settings"));
    return defaultSettings || { fontSize: "initial", bookmarkColor: "#980000" };
  });

  useEffect(() => {
    // Save the settings object to localStorage whenever it changes
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Function to update a specific setting
  const updateSettings = (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value, // Only update the specific setting
    }));
  };

  const contextValue = {
    settings, // Expose the full settings object
    updateSettings, // Function to update a specific setting
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
