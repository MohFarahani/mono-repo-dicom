'use client';

import { Box } from '@mui/material';
import DicomTable from '@/components/DicomTable/DicomTable';
import { useGetAllDicomFiles } from '@/hooks/useGetAllDicomFiles';
import { LogService } from '@/utils/logging';

const HomePage = () => {
  const { data, loading, error } = useGetAllDicomFiles();

  if (error) {
    LogService.error('Failed to load DICOM files in home page', error);
    return <div>Error loading DICOM files. Please try again later.</div>;
  }

  LogService.debug('Rendering home page', { 
    fileCount: data?.length ?? 0,
    loading 
  });
  
  return (
    <Box sx={{ height: 600 }}>
      <DicomTable 
        data={data || []} 
        loading={loading}
        title="Available DICOM Data"
      />
    </Box>
  );
}

export default HomePage;