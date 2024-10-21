"use client";
import React, { createContext, useState, ReactNode } from "react";

interface SoundCloudContextProps {
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const SoundCloudContext = createContext<SoundCloudContextProps>({
  currentUrl: "",
  setCurrentUrl: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
});

interface SoundCloudProviderProps {
  children: ReactNode;
}

export const SoundCloudProvider: React.FC<SoundCloudProviderProps> = ({
  children,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <SoundCloudContext.Provider
      value={{ currentUrl, setCurrentUrl, isPlaying, setIsPlaying }}
    >
      {children}
    </SoundCloudContext.Provider>
  );
};
