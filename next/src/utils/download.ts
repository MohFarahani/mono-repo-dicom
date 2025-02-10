import { ROUTES } from "@/constants/routes";
import axios from "axios";

type DownloadOptions = {
  delay?: number;
};

export const downloadFiles = async (
  filePaths: string | string[],
  options: DownloadOptions = { delay: 500 }
) => {
  try {
    // Convert single path to array if needed
    const pathsToDownload = Array.isArray(filePaths) ? filePaths : [filePaths];
    
    // Download each file sequentially to avoid overwhelming the browser
    for (const filePath of pathsToDownload) {
      const response = await axios.get(`${ROUTES.API.DOWNLOAD}?filePath=${encodeURIComponent(filePath)}`, {
        responseType: 'blob'
      });
      
      if (!response.data) {
        throw new Error(`Failed to download ${filePath}`);
      }

      // Create blob from response
      const blob = response.data;
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'dicom-file';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Add a delay between downloads if specified
      if (options.delay && pathsToDownload.length > 1) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }
    }
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}; 