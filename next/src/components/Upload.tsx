'use client';

import { useState, useRef, DragEvent } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { UPLOAD } from '@/constants/ui';
import { AppError } from '@/utils/errorHandling';

interface UploadProps {
  onFileSelect?: (files: File[]) => void;
  maxSize?: number; // in MB
  fileStatuses?: { file: File; exists: boolean }[];
}

export const Upload = ({ 
  onFileSelect, 
  maxSize = UPLOAD.MAX_FILE_SIZE_MB,
  fileStatuses = [],
}: UploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      throw new AppError(
        `File size should be less than ${maxSize}MB`,
        'FILE_SIZE_ERROR',
        400
      );
    }

    const fileName = file.name.toLowerCase();
    if (!UPLOAD.ACCEPTED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
      throw new AppError(
        'Please upload valid DICOM (.dcm) files',
        'INVALID_FILE_TYPE',
        400
      );
    }

    return true;
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    setError('');

    try {
      for (const file of newFiles) {
        if (validateFile(file)) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        setFiles(validFiles);
        if (onFileSelect) {
          onFileSelect(validFiles);
        }
      }
    } catch (err) {
      if (err instanceof AppError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while processing files');
      }
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDelete = (fileToDelete: File) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFiles = files.filter(file => file !== fileToDelete);
    setFiles(updatedFiles);
    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect([]);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          border: error 
            ? '2px dashed error.main' 
            : dragActive 
              ? '2px dashed primary.main' 
              : '2px dashed grey.300',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: error ? 'error.main' : 'primary.main',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".dcm"
          multiple
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        <Stack spacing={2} alignItems="center">
          <CloudUploadIcon 
            sx={{ 
              fontSize: 48, 
              color: error ? 'error.main' : 'primary.main' 
            }} 
          />
          
          {files.length === 0 ? (
            <>
              <Typography variant="h6" component="span">
                Drag and drop your DICOM files here
              </Typography>
              <Typography variant="body2" color="textSecondary">
                or click to select DICOM files (.dcm)
              </Typography>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Stack spacing={1} sx={{ mb: 2 }}>
                {files.map((file, index) => {
                  const status = fileStatuses.find(s => s.file === file);
                  
                  return (
                    <Stack
                      key={`${file.name}-${index}`}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ 
                        p: 2, 
                        bgcolor: status?.exists ? 'action.hover' : 'background.default',
                        borderRadius: 1,
                      }}
                    >
                      <InsertDriveFileIcon color={status?.exists ? "disabled" : "primary"} />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.name}
                      </Typography>
                      {status?.exists ? (
                        <Typography variant="body2" color="text.secondary">
                          Already exists
                        </Typography>
                      ) : (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={handleDelete(file)}
                            startIcon={<DeleteIcon />}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
              {files.length > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleClearAll}
                  startIcon={<DeleteIcon />}
                >
                  Clear All Files
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};