import { Box } from '@mui/material';
import Viewer from 'react-viewer';
import { DicomViewerfData } from './types';
import { ImageControls } from './ImageControls';
import { Magnifier } from './Magnifier';
import { useDicomViewer } from '@/hooks/useDicomViewer';

interface ImageViewerProps {
  dicomData: DicomViewerfData;
  showControls?: boolean;
  showModal?: boolean;
}

export const ImageViewer = ({ 
  dicomData, 
  showControls = true, 
  showModal = true 
}: ImageViewerProps) => {
  const dicomViewerProps = useDicomViewer();
  const imageUrl = `data:image/png;base64,${dicomData.image.data}`;

  const handleModalImageClick = () => {
    if (showModal) {
      dicomViewerProps.handleImageClick();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          filter: `contrast(${dicomViewerProps.contrast}%) brightness(${dicomViewerProps.brightness}%)`,
          mb: showControls ? 2 : 0,
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <Magnifier
          src={imageUrl}
          enabled={dicomViewerProps.magnifierEnabled}
          magnification={dicomViewerProps.magnification}
          magnifierSize={180}
          onClick={handleModalImageClick}
        />
      </Box>

      {showControls && <ImageControls {...dicomViewerProps} />}

      {showModal && (
        <Viewer
          visible={dicomViewerProps.visible}
          onClose={() => dicomViewerProps.setVisible(false)}
          images={[{
            src: imageUrl,
            alt: 'DICOM Image'
          }]}
          zoomable
          rotatable
          scalable
          downloadable
          noNavbar
          zoomSpeed={0.2}
          defaultSize={{
            width: dicomData.image.width,
            height: dicomData.image.height
          }}
          noToolbar={false}
          customToolbar={(config) => {
            config.forEach(item => {
              if (item.key === 'download') {
                item.onClick = () => dicomViewerProps.handleDownload(imageUrl, dicomData.StudyDate);
              }
            });
            return config;
          }}
        />
      )}
    </Box>
  );
}; 