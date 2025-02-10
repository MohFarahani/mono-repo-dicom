// src/hooks/useGetAllDicomFiles.ts
import { useQuery } from '@apollo/client';
import { GET_ALL_DICOM_FILES } from '@/graphql/operations';
import { DicomData } from '@/graphql/types';



export const useGetAllDicomFiles = () => {
  const { data, loading, error, refetch } = useQuery<{ getAllDicomFiles: DicomData[] }>(
    GET_ALL_DICOM_FILES,
    {
      fetchPolicy: 'cache-and-network', // Use cached data first, then update from network
      nextFetchPolicy: 'cache-first', // Subsequent fetches will use cache first
    }
  );

  return {
    data: data?.getAllDicomFiles || [],
    loading,
    error,
    refetch,
  };
};