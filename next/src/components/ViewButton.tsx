// ViewButton.tsx
'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ViewButtonProps {
  filePath: string;
  selectedFiles: string[];
  routePath: string;
  disabled?: boolean;
}

const ViewButton = ({ filePath, selectedFiles, routePath, disabled }: ViewButtonProps) => {
  const router = useRouter();

  const handleViewImage = () => {
    if (selectedFiles.length > 1) {
      // For multiple files, encode the array as a query parameter
      const encodedFiles = encodeURIComponent(JSON.stringify(selectedFiles));
      router.push(`${routePath}?files=${encodedFiles}`);
    } else {
      // For single file, use the original behavior
      const encodedFilePath = encodeURIComponent(filePath);
      router.push(`${routePath}?filePath=${encodedFilePath}`);
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      color="secondary"
      onClick={handleViewImage}
      disabled={disabled}
    >
      View
    </Button>
  );
};

export default ViewButton;