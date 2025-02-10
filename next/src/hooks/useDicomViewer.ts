import { useContext } from 'react';
import { DicomViewerContext } from '@/providers/DicomViewerProvider';

export const useDicomViewer = () => {
  const context = useContext(DicomViewerContext);
  if (!context) {
    throw new Error('useDicomViewer must be used within a DicomViewerProvider');
  }
  return context;
}; 