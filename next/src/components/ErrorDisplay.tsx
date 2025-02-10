import { Alert, AlertTitle, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity="error"
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;
