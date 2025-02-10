'use client';

import { useState, useEffect } from "react";
import { DicomData } from "@/graphql/types";
import DicomPreviewLayout from "@/components/DicomPreviewLayout";
import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { ROUTES } from '@/constants/routes';

interface MultiPreviewPageProps {
  files: string[];
}

const MultiPreviewPage = ({ files }: MultiPreviewPageProps) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (files.length > 0) {
      setSelectedFilePath(files[0]);
    }
  }, [files]);

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

export default MultiPreviewPage;