import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeSettings = {
  menuIcon: "rocket" | "shield";
  animationSpeed: "fast" | "smooth";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  customBackgroundColor?: string;
  sidebarPosition?: "left" | "right";
};

export const defaultThemeSettings: ThemeSettings = {
  menuIcon: "rocket",
  animationSpeed: "smooth",
  primaryColor: "#8b5cf6",
  secondaryColor: "#6366f1",
  accentColor: "#f59e0b",
  backgroundColor: "red",
  textColor: "#ffffff",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
  customBackgroundColor: "#18181b",
  sidebarPosition: "left",
};

const ThemeContext = createContext<{
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  resetThemeSettings: () => void;
}>({
  themeSettings: defaultThemeSettings,
  setThemeSettings: () => {},
  resetThemeSettings: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const savedSettings = localStorage.getItem("xeno-adminmenu-theme");
      if (savedSettings) {
        return { ...defaultThemeSettings, ...JSON.parse(savedSettings) };
      }
    } catch (e) {
      console.error("Failed to parse theme settings from localStorage");
    }
    return defaultThemeSettings;
  });

  useEffect(() => {
    localStorage.setItem("xeno-adminmenu-theme", JSON.stringify(themeSettings));

    const root = document.documentElement;
    root.style.setProperty(
      "--text-color",
      themeSettings.textColor || "#ffffff",
    );
    root.style.setProperty(
      "--border-radius",
      themeSettings.borderRadius || "4px",
    );
    root.style.setProperty("--font-size", themeSettings.fontSize || "14px");
    root.style.setProperty(
      "--font-family",
      themeSettings.fontFamily || "Inter, sans-serif",
    );
    root.style.setProperty(
      "--background-global",
      themeSettings.customBackgroundColor || "#18181b",
    );
    root.style.setProperty(
      "--animation-speed",
      themeSettings.animationSpeed === "fast" ? "0.2s" : "0.5s",
    );
    root.style.setProperty(
      "--sidebar-position",
      themeSettings.sidebarPosition === "left" ? "0" : "calc(100% - 250px)",
    );
  }, [themeSettings]);

  const resetThemeSettings = () => {
    setThemeSettings(defaultThemeSettings);
    localStorage.removeItem("xeno-adminmenu-theme");
  };

  return (
    <ThemeContext.Provider
      value={{ themeSettings, setThemeSettings, resetThemeSettings }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
