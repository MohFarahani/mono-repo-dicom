'use client';

import { Box, Typography, Paper } from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { TABLE, BORDERS } from '@/constants/ui';

// Custom toolbar component
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export interface GenericTableProps<T> {
  data: T[];
  columns: GridColDef[];
  loading?: boolean;
  title?: string;
  onSelectionChange?: (selectedRows: T[]) => void;
  idField?: keyof T | ((item: T) => string);
  enableSelection?: boolean;
}

export const Table = <T extends object>({ 
  data = [],
  columns,
  loading = false, 
  title = 'Data Table',
  onSelectionChange,
  idField = 'id' as keyof T,
  enableSelection = false,
}: GenericTableProps<T>) => {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  
  const safeData = Array.isArray(data) ? data.map((item, index) => ({
    ...item,
    id: typeof idField === 'function' 
      ? idField(item) 
      : String(item[idField] ?? `row-${index}`)
  })) : [];

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    setSelectionModel(newSelectionModel);
    const selectedRows = safeData.filter(row => 
      newSelectionModel.includes(String(row.id))
    );
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ 
        flexGrow: 1,
        width: '100%',
        height: 'calc(100% - 40px)',
        minHeight: 400,
        overflow: 'hidden'
      }}>
        {safeData.length === 0 && !loading ? (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ py: 2 }}
          >
            No data available.
          </Typography>
        ) : (
          <DataGrid
            rows={safeData}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: TABLE.DEFAULT_PAGE_SIZE },
              },
            }}
            pageSizeOptions={TABLE.PAGE_SIZE_OPTIONS}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              height: '100%',
              minHeight: TABLE.MIN_HEIGHT,
              border: BORDERS.DEFAULT,
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-toolbarContainer': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                padding: '8px 6px',
              },
              '& .MuiDataGrid-main': {
                borderRadius: 1,
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#fff',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-columnHeaders': {
                display: 'flex',
                alignItems: 'center',
                minHeight: '56px',
              },
              '& .MuiDataGrid-columnHeader': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              },
              '& .MuiDataGrid-cell': {
                display: 'flex !important',
                alignItems: 'center !important',
                justifyContent: 'center !important',
                minHeight: '52px !important',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                padding: '8px',
                fontSize: '0.875rem',
                '& > *': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              },
            }}
            getRowHeight={() => TABLE.ROW_HEIGHT}
            checkboxSelection={enableSelection}
            disableRowSelectionOnClick={enableSelection}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={handleSelectionChange}
          />
        )}
      </Box>
    </Paper>
  );
};

export default Table;

