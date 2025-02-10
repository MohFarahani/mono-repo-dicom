'use client';

import DicomPreviewLayout from "@/components/DicomPreviewLayout";
import { useGetAllDicomFiles } from "@/hooks/useGetAllDicomFiles";
import { useState } from "react";
import { LogService } from '@/utils/logging';
const PreviewPage = () => {
  const { data, loading, error } = useGetAllDicomFiles();
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');

  if (error) {
    LogService.error('Failed to fetch DICOM files in preview page', error);
    return <div>Error loading DICOM files. Please try again later.</div>;
  }

  LogService.debug('Rendering preview page', { 
    fileCount: data?.length ?? 0,
    loading 
  });

  return (
    <DicomPreviewLayout
      files={data}
      loading={loading}
      selectedFilePath={selectedFilePath}
      onSelectImage={(path) => {
        LogService.debug('Selected image in preview', { path });
        setSelectedFilePath(path);
      }}
    />
  );
};

export default PreviewPage;