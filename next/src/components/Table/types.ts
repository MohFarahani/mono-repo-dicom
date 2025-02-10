import { DicomData } from '@/graphql/types';
import { GridColDef } from '@mui/x-data-grid';

export interface DicomDataTable extends DicomData {
  id: string;
}

export interface TableProps {
  data: DicomDataTable[];
  loading?: boolean;
  columns?: GridColDef[];
  title?: string;
}

