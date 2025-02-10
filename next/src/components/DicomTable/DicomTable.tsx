'use client';

import { DicomData } from '@/graphql/types';
import Table from '../Table';
import { DicomColumns } from './DicomColumns';
import { DownloadProvider } from '@/providers/DownloadProvider';
import { useState } from 'react';
import { DicomDataTable } from '../Table/types';
import { handleApiError } from '@/utils/errorHandling';
import ErrorDisplay from '../ErrorDisplay';

export const DicomTable = ({ data, loading, title, error }: { 
  data: DicomData[],
  loading?: boolean,
  title?: string,
  error?: unknown
}) => {
  const [selectedRows, setSelectedRows] = useState<DicomDataTable[]>([]);

  if (error) {
    const errorResponse = handleApiError(error);
    const errorMessage = errorResponse instanceof Response ? 
      JSON.parse(errorResponse.body as unknown as string).error : 
      'An unexpected error occurred';
    return <ErrorDisplay error={errorMessage} />;
  }

  return (
    <DownloadProvider>
      <Table
        data={data}
        loading={loading}
        title={title}
        columns={DicomColumns(selectedRows)}
        enableSelection
        onSelectionChange={(rows) => setSelectedRows(rows as DicomDataTable[])}
      />
    </DownloadProvider>
  );
};

export default DicomTable; 