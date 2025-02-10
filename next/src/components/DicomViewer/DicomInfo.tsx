import { 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid, 
  Divider 
} from '@mui/material';
import { DicomViewerfData } from './types';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DicomInfoProps {
  dicomData: DicomViewerfData;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
    <Box sx={{ color: 'primary.main' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

export const DicomInfo = ({ dicomData }: DicomInfoProps) => {
  return (
    <Accordion 
      sx={{ 
        mb: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        '&:before': {
          display: 'none', // Removes the default divider
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          color: 'primary.main',
          '& .MuiAccordionSummary-content': {
            my: 1,
          },
          borderBottom: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          DICOM Information
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<PersonIcon />}
              label="Patient Name"
              value={dicomData.PatientName}
            />
            <Divider sx={{ my: 1 }} />
            <InfoItem
              icon={<CalendarTodayIcon />}
              label="Study Date"
              value={dicomData.StudyDate}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<DescriptionIcon />}
              label="Study Description"
              value={dicomData.StudyDescription}
            />
            <Divider sx={{ my: 1 }} />
            <InfoItem
              icon={<DescriptionIcon />}
              label="Series Description"
              value={dicomData.SeriesDescription}
            />
            <Divider sx={{ my: 1 }} />
            <InfoItem
              icon={<LocalHospitalIcon />}
              label="Modality"
              value={dicomData.Modality}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}; 