import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CHECK_FILE_PATH_EXISTS, PROCESS_DICOM_UPLOAD } from '@/graphql/operations';
import { DicomDataTable } from '@/components/Table/types';
import axios from 'axios';
import { useApolloClient } from '@apollo/client';
import { LogService } from '@/utils/logging';
import { DateService } from '@/utils/dates';
import { ROUTES } from '@/constants/routes';

interface ProcessDicomResponse {
  error?: string;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  filePath: string;
}

interface FileStatus {
  file: File;
  exists: boolean;
}

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useDicomUpload = () => {
  const [dicomData, setDicomData] = useState<DicomDataTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  
  const [processDicomUpload] = useMutation(PROCESS_DICOM_UPLOAD);
  const client = useApolloClient();

  const processFile = async (file: File, retryCount = 0): Promise<ProcessDicomResponse> => {
    try {
      LogService.debug('Uploading file', { 
        fileName: file.name, 
        endpoint: ROUTES.API.PROCESS_DICOM 
      });

      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post<ProcessDicomResponse>(
        ROUTES.API.PROCESS_DICOM,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        LogService.warn('Retrying file upload', { 
          fileName: file.name, 
          attempt: retryCount + 1,
          error: axios.isAxiosError(error) ? error.message : 'Unknown error'
        });
        await sleep(RETRY_DELAY * (retryCount + 1));
        return processFile(file, retryCount + 1);
      }
      throw error;
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setLoading(true);
    setError(null);
    const statuses: FileStatus[] = [];
    const newData: DicomDataTable[] = [];
    
    try {
      for (const file of files) {
        try {
          const dicomData = await processFile(file);
  
          // Check if file exists
          const { data: existingFile } = await client.query({
            query: CHECK_FILE_PATH_EXISTS,
            variables: { filePath: dicomData.filePath }
          });
  
          if (existingFile?.checkFilePathExists) {
            LogService.warn('File already exists, skipping upload', { 
              filePath: dicomData.filePath 
            });
            statuses.push({ file, exists: true });
            continue;
          }
  
          statuses.push({ file, exists: false });
  
          // Process non-existing files
          const { data: graphQLData } = await processDicomUpload({
            variables: {
              input: {
                patientName: dicomData.PatientName,
                studyDate: dicomData.StudyDate,
                studyDescription: dicomData.StudyDescription || '',
                seriesDescription: dicomData.SeriesDescription || '',
                modality: dicomData.Modality,
                filePath: dicomData.filePath,
              },
            },
          });
  
          if (graphQLData?.processDicomUpload) {
            const formattedDate = DateService.formatDateString(dicomData.StudyDate);
            
            newData.push({
              id: Date.now() + Math.random().toString(),
              PatientName: dicomData.PatientName,
              StudyDate: DateService.toISODate(formattedDate),
              StudyDescription: dicomData.StudyDescription,
              SeriesDescription: dicomData.SeriesDescription,
              Modality: dicomData.Modality,
              FilePath: graphQLData.processDicomUpload.FilePath,
            });
          }
        } catch (fileError) {
          LogService.error('Error processing file', { 
            fileName: file.name, 
            error: fileError 
          });
          // Continue with next file instead of breaking the entire upload
          continue;
        }
      }
  
      setFileStatuses(statuses);
      setDicomData(prevData => [...prevData, ...newData]);
  
    } catch (error) {
      LogService.error('Error in file upload', { error });
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to process files'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    dicomData,
    loading,
    error,
    handleFileUpload,
    clearError: () => setError(null),
    fileStatuses,
  };
};