'use client';

import { createContext,  useState, ReactNode } from 'react';

interface DicomViewerContextType {
  // Image controls state
  contrast: number;
  brightness: number;
  magnifierEnabled: boolean;
  magnification: number;
  visible: boolean;
  
  // Image control actions
  setContrast: (value: number) => void;
  setBrightness: (value: number) => void;
  setMagnifierEnabled: (enabled: boolean) => void;
  setMagnification: (value: number) => void;
  setVisible: (visible: boolean) => void;
  handleReset: () => void;
  handleImageClick: () => void;
  handleDownload: (imageUrl: string, studyDate?: string) => void;
}

export const DicomViewerContext = createContext<DicomViewerContextType | undefined>(undefined);

export function DicomViewerProvider({ children }: { children: ReactNode }) {
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [magnification, setMagnification] = useState(2);
  const [visible, setVisible] = useState(false);

  const handleReset = () => {
    setContrast(100);
    setBrightness(100);
    setMagnifierEnabled(false);
    setMagnification(2);
  };

  const handleImageClick = () => {
    setVisible(true);
  };

  const handleDownload = (imageUrl: string, studyDate?: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dicom-image-${studyDate || 'download'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DicomViewerContext.Provider
      value={{
        contrast,
        brightness,
        magnifierEnabled,
        magnification,
        visible,
        setContrast,
        setBrightness,
        setMagnifierEnabled,
        setMagnification,
        setVisible,
        handleReset,
        handleImageClick,
        handleDownload,
      }}
    >
      {children}
    </DicomViewerContext.Provider>
  );
} 