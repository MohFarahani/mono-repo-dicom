import React from 'react';
import {  Skeleton, ImageListItem, ImageListItemBar, IconButton, Stack, Typography } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { useDicomData } from "@/hooks/useDicomData";
import Image from 'next/image';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';

interface PreviewItemProps {
  file: DicomData;
  isSelected: boolean;
  onClick: () => void;
}

const imageListItemStyles = {
  mb: 2,
  cursor: 'pointer',
  border: '2px solid',
  width: '100% !important',
  aspectRatio: '4/3',
  position: 'relative',
  '.MuiImageListItemBar-root': {
    transform: 'translateY(100%)',
    opacity: 0,
    transition: 'transform 200ms ease-in-out, opacity 200ms ease-in-out'
  },
  '&:hover': {
    opacity: 0.8,
    '.MuiImageListItemBar-root': {
      transform: 'translateY(0)',
      opacity: 1
    }
  }
} as const;

const imageStyles = {
  objectFit: 'contain' as const
};

const iconButtonStyles = {
  color: 'rgba(255, 255, 255, 0.54)'
} as const;

export const PreviewItem = React.memo(({ file, isSelected, onClick }: PreviewItemProps) => {
  const { data: dicomData, loading, error } = useDicomData(file.FilePath);

  if (loading) {
    return <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />;
  }

  if (error || !dicomData?.image?.data) {
    return null;
  }

  const TitleContent = (
    <Stack direction="row" spacing={1} alignItems="center">
      <PersonIcon fontSize="small" />
      <Typography variant="body1">{dicomData.PatientName}</Typography>
    </Stack>
  );

  const SubtitleContent = (
    <Stack direction="row" spacing={1} alignItems="center">
      <DescriptionIcon fontSize="small" />
      <Typography variant="body2">{dicomData.StudyDescription}</Typography>
    </Stack>
  );

  return (
    <ImageListItem 
      onClick={onClick}
      sx={{
        ...imageListItemStyles,
        borderColor: isSelected ? 'primary.main' : 'transparent'
      }}
    >
      <Image 
        src={`data:image/png;base64,${dicomData.image.data}`}
        alt={`Preview - ${file.PatientName}`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        style={imageStyles}
      />
      <ImageListItemBar
        title={TitleContent}
        subtitle={SubtitleContent}
        actionIcon={
          <IconButton
            sx={iconButtonStyles}
            aria-label={`info about ${file.PatientName}`}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
});

PreviewItem.displayName = 'PreviewItem'; 