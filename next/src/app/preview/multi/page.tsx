'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { DicomData } from "@/graphql/types";
import dynamic from 'next/dynamic';

import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { LogService } from '@/utils/logging';

const DicomPreviewLayout = dynamic(
  () => import('@/components/DicomPreviewLayout'),
  { ssr: false }
);

const MultiPreviewContent = () => {
  const searchParams = useSearchParams();
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    const filesParam = searchParams?.get('files');
    if (filesParam) {
      try {
        const decodedFiles = JSON.parse(decodeURIComponent(filesParam));
        LogService.debug('Decoded files for multi preview', { fileCount: decodedFiles.length });
        setFiles(decodedFiles);
        if (decodedFiles.length > 0) {
          setSelectedFilePath(decodedFiles[0]);
        }
      } catch (error) {
        LogService.error('Error parsing files parameter in multi preview', error);
        console.error('Error parsing files parameter:', error);
      }
    } else {
      LogService.warn('No files parameter provided for multi preview');
    }
  }, [searchParams]);

  // Convert files to DicomData format
  const filesList: DicomData[] = files.map((filePath) => ({
    FilePath: filePath,
    PatientName: '',
    StudyDate: '',
    Modality: '',
  }));

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
    <DicomPreviewLayout
      files={filesList}
      loading={false}
      selectedFilePath={selectedFilePath}
      onSelectImage={setSelectedFilePath}
    />
    </Container>

  );
};

const MultiPreviewPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiPreviewContent />
    </Suspense>
  );
};

export default MultiPreviewPage; 