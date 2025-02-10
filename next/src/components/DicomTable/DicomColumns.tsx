'use client';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DicomDataTable } from '../Table/types';
import ViewButton from '../ViewButton';
import { useDownload } from '@/providers/DownloadProvider';
import { LoadingButton } from '@mui/lab';
import { ROUTES } from '@/constants/routes';
import { downloadFiles } from '@/utils/download';
import { DateService } from '@/utils/dates';

// Update the DownloadCell component
const DownloadCell = ({ params, selectedRows }: { 
  params: GridRenderCellParams<DicomDataTable>, 
  selectedRows: DicomDataTable[] 
}) => {
  const { isLoading, setIsLoading } = useDownload();
  const isRowSelected = selectedRows.some(row => row.id === params.row.id);
  const hasOtherRowsSelected = selectedRows.length > 0 && !isRowSelected;
  const shouldShowLoading = isLoading && (isRowSelected || selectedRows.length === 0);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const filePaths = selectedRows.length > 0 
        ? selectedRows.map(row => row.FilePath)
        : params.row.FilePath;
      await downloadFiles(filePaths);
    } catch  {
      alert('Failed to download one or more files');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="contained"
      size="small"
      color="secondary"
      onClick={handleClick}
      disabled={hasOtherRowsSelected || (isLoading && !shouldShowLoading)}
      loading={shouldShowLoading}
      loadingPosition="center"
      sx={{
        fontSize: '0.7rem',
      }}
    >
      {selectedRows.length > 0 ? `Download ${selectedRows.length} Files` : 'Download'}
    </LoadingButton>
  );
};

export const DicomColumns = (selectedRows: DicomDataTable[] = []): GridColDef<DicomDataTable>[] => {
  return [
    {
      field: 'PatientName',
      headerName: 'Patient Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'StudyDate',
      headerName: 'Study Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return DateService.formatDateToMonthDayYear(params.row?.StudyDate);
      },
    },
    {
      field: 'SeriesDescription',
      headerName: 'Series Description',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Modality',
      headerName: 'Modality',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'download',
      headerName: 'Download',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<DicomDataTable>) => (
        <DownloadCell params={params} selectedRows={selectedRows} />
      ),
    },
    {
      field: 'FilePath',
      headerName: 'View Image',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<DicomDataTable>) => {
        const isRowSelected = selectedRows.some(row => row.id === params.row.id);
        const hasOtherRowsSelected = selectedRows.length > 0 && !isRowSelected;

        return (
          <ViewButton
            filePath={params.row.FilePath}
            selectedFiles={selectedRows.length > 0 ? selectedRows.map(row => row.FilePath) : [params.row.FilePath]}
            routePath={selectedRows.length > 1 ? ROUTES.PREVIEW.MULTI : ROUTES.HOME.PREVIEW}
            disabled={hasOtherRowsSelected}
          />
        );
      },
    },
  ];
};