'use client';

import { ImageList, Box, Skeleton } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { PreviewItem } from './PreviewItem';

interface ImagePreviewListProps {
  files: DicomData[];
  loading: boolean;
  selectedFilePath: string;
  onSelectImage: (filePath: string) => void;
}

export const ImagePreviewList = ({ 
  files, 
  loading, 
  selectedFilePath,
  onSelectImage 
}: ImagePreviewListProps) => {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <ImageList 
        sx={{ 
          width: '100%',
          gap: 16 // Add gap between items
        }}
        cols={1} // Show items vertically
      >
        {files.map((file,index) => (
          <PreviewItem
            key={file.FilePath+index}
            file={file}
            isSelected={file.FilePath === selectedFilePath}
            onClick={() => onSelectImage(file.FilePath)}
          />
        ))}
      </ImageList>
    </Box>
  );
}; 