'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useDicomData } from '@/hooks/useDicomData';
import { DicomInfo } from './DicomInfo';
import { ImageViewer } from './ImageViewer';
import ErrorDisplay from '../ErrorDisplay';
import { DicomViewerProvider } from '@/providers/DicomViewerProvider';

interface DicomViewerProps {
  filePath: string;
  showControls?: boolean;
  showInfo?: boolean;
  showModal?: boolean;
}

const DicomViewer = ({ 
  filePath, 
  showControls = true, 
  showInfo = true,
  showModal = true 
}: DicomViewerProps) => {
  const { data: dicomData, loading, error, refetch } = useDicomData(filePath);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  if (!dicomData || !dicomData.image?.data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No image data available</Typography>
      </Box>
    );
  }

  return (
    <DicomViewerProvider>
      <Box height='100%'>
        {showInfo && <DicomInfo dicomData={dicomData} />}
        <ImageViewer 
          dicomData={dicomData} 
          showControls={showControls}
          showModal={showModal}
        />
      </Box>
    </DicomViewerProvider>
  );
};

export default DicomViewer;