'use client';

import { Box, ImageList, ImageListItem } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { SCROLLBAR, SPACING } from '@/constants/ui';
import Image from 'next/image';
import { ROUTES } from "@/constants/routes";
import { memo, useMemo } from 'react';

const scrollbarStyles = {
  height: 'calc(100vh - 100px)',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: SCROLLBAR.WIDTH,
  },
  '&::-webkit-scrollbar-track': {
    background: SCROLLBAR.TRACK_COLOR,
  },
  '&::-webkit-scrollbar-thumb': {
    background: SCROLLBAR.THUMB_COLOR,
    borderRadius: SCROLLBAR.BORDER_RADIUS,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: SCROLLBAR.THUMB_HOVER_COLOR,
  },
};

const DicomImageItem = memo(({ 
  file, 
  isSelected, 
  onSelect 
}: { 
  file: DicomData; 
  isSelected: boolean; 
  onSelect: (path: string) => void;
}) => {
  const imageUrl = useMemo(() => 
    `${ROUTES.API.PROCESS_DICOM}?filePath=${encodeURIComponent(file.FilePath)}`,
    [file.FilePath]
  );

  const imageAlt = useMemo(() => 
    `${file.PatientName} - ${file.StudyDescription || ''}`,
    [file.PatientName, file.StudyDescription]
  );

  const itemStyles = useMemo(() => ({
    cursor: 'pointer',
    border: isSelected ? '2px solid #1976d2' : 'none',
    borderRadius: '4px',
    '&:hover': {
      opacity: 0.8,
    },
  }), [isSelected]);

  return (
    <ImageListItem 
      onClick={() => onSelect(file.FilePath)}
      sx={itemStyles}
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={300}
        height={300}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // shortened for brevity
      />
    </ImageListItem>
  );
});

DicomImageItem.displayName = 'DicomImageItem';

interface DicomImageListProps {
  dicomFiles: DicomData[];
  selectedFilePath: string;
  onSelectImage: (filePath: string) => void;
}

export const DicomImageList = memo(({ 
  dicomFiles, 
  selectedFilePath, 
  onSelectImage 
}: DicomImageListProps) => {
  const renderedItems = useMemo(() => 
    dicomFiles.map((file,index) => (
      <DicomImageItem
        key={file.FilePath+index}
        file={file}
        isSelected={selectedFilePath === file.FilePath}
        onSelect={onSelectImage}
      />
    )),
    [dicomFiles, selectedFilePath, onSelectImage]
  );

  return (
    <Box sx={scrollbarStyles}>
      <ImageList cols={2} gap={SPACING.LIST_GAP}>
        {renderedItems}
      </ImageList>
    </Box>
  );
});

DicomImageList.displayName = 'DicomImageList'; 