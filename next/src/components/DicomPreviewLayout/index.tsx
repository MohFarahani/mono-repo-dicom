import { Box } from "@mui/material";
import { ImagePreviewList } from "@/components/ImagePreviewList";
import DicomViewer from "@/components/DicomViewer";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { DicomData } from "@/graphql/types";

interface DicomPreviewLayoutProps {
  files: DicomData[]; // Replace 'any' with your file type
  loading: boolean;
  selectedFilePath: string;
  onSelectImage: (path: string) => void;
  showInfo?: boolean;
  showControls?: boolean;
  showModal?: boolean;
}

const DicomPreviewLayout = ({
  files,
  loading,
  selectedFilePath,
  onSelectImage,
  showInfo = true,
  showControls = true,
  showModal = true,
}: DicomPreviewLayoutProps) => {
  const leftContent = (
    <ImagePreviewList 
      files={files} 
      loading={loading}
      selectedFilePath={selectedFilePath}
      onSelectImage={onSelectImage}
    />
  );

  const rightContent = selectedFilePath ? (
    <DicomViewer 
      filePath={selectedFilePath} 
      showInfo={showInfo}
      showControls={showControls}
      showModal={showModal}
    />
  ) : (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100%"
    >
      Select an image to view details
    </Box>
  );

  return (
    <TwoColumnLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default DicomPreviewLayout; 