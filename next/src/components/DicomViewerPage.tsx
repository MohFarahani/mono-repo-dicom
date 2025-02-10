'use client';

import DicomViewer from "@/components/DicomViewer/index";
import { Container, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '@/constants/routes';
import { LogService } from '@/utils/logging';

interface DicomViewerPageProps {
    queryFilePath: string;
}

const DicomViewerPage = ({queryFilePath}: DicomViewerPageProps) => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');

  useEffect(() => {
    
    if (!queryFilePath) {
      LogService.error('No file path provided in preview page', new Error('Missing file path'));
      setError('No file path provided');
      return;
    }

    try {
      const decodedPath = decodeURIComponent(queryFilePath);
      LogService.debug('Decoded file path for preview', { path: decodedPath });
      setFilePath(decodedPath);
    } catch (error) {
      LogService.error('Failed to decode file path', error);
      setError('Invalid file path');
    }
  }, [queryFilePath]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={() => router.push(ROUTES.HOME.ROOT)}
          startIcon={<ArrowBackIcon />}
        >
          Back to Home
        </Button>
      </Box>
      {filePath && <DicomViewer filePath={filePath} />}
    </Container>
  );
};

export default DicomViewerPage;