// src/components/Main.tsx
'use client';

import { Container, Box, Typography, Stack, Alert, Snackbar } from '@mui/material';
import { Upload } from '@/components/Upload';
import DicomTable from './DicomTable/DicomTable';
import { useDicomUpload } from '@/hooks/useDicomUploald';
import { handleApiError } from '@/utils/errorHandling';

const UploadPage = () => {
  
  const { 
    dicomData, 
    loading, 
    error, 
    handleFileUpload, 
    clearError,
    fileStatuses
  } = useDicomUpload();

  const errorResponse = error ? handleApiError(error) : null;

  return (
    <Container maxWidth="lg">
      <Stack spacing={4} my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          DICOM File Upload
        </Typography>
        
        <Upload onFileSelect={handleFileUpload} fileStatuses={fileStatuses} />
        
        <Box sx={{ height: 600 }}>
          <DicomTable 
            data={dicomData} 
            loading={loading}
            title="DICOM Data"
          />
        </Box>

        <Snackbar 
          open={!!errorResponse} 
          autoHideDuration={6000} 
          onClose={clearError}
        >
          <Alert severity="error" onClose={clearError}>
            {errorResponse instanceof Response ? 
              JSON.parse(errorResponse.body as unknown as string).error : 
              'An unexpected error occurred'}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};

export default UploadPage;