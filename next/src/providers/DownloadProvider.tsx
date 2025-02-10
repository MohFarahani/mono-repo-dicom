'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DownloadContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DownloadContext = createContext<DownloadContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useDownload = () => useContext(DownloadContext);

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DownloadContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </DownloadContext.Provider>
  );
} 