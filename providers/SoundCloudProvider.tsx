"use client";
import React, { createContext, useState, ReactNode } from "react";

interface SoundCloudContextProps {
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
}

export const SoundCloudContext = createContext<SoundCloudContextProps>({
  currentUrl: "",
  setCurrentUrl: () => {},
});

interface SoundCloudProviderProps {
  children: ReactNode;
}

export const SoundCloudProvider: React.FC<SoundCloudProviderProps> = ({
  children,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  return (
    <SoundCloudContext.Provider value={{ currentUrl, setCurrentUrl }}>
      {children}
    </SoundCloudContext.Provider>
  );
};
