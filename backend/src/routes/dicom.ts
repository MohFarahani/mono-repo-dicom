import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import { LogService } from '@/utils/logging';
import fs from 'fs';

const router = Router();

// Get upload directory from environment variable
const uploadDir = process.env.DICOM_FILES_PATH || path.join(__dirname, '../../dicom_files');
LogService.info('Using DICOM files directory:', { uploadDir });

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  LogService.info('Created DICOM files directory');
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// Add file filter
const fileFilter = (req: any, file: any, cb: any) => {
  // Accept all files for now - DICOM files don't always have a standard extension
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Helper function to process DICOM file
const processDicomFile = async (filePath: string, fileName: string, res: Response) => {
  let hasResponded = false;

  try {
    const scriptPath = path.join(__dirname, '../../scripts/process_dicom.py');
    const pythonPath = process.env.PYTHON_PATH || '/opt/venv/bin/python3';
    
    LogService.debug('Processing DICOM file', { 
      filePath,
      fileName,
      scriptPath,
      pythonPath
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      LogService.error('File not found', { filePath });
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if Python script exists
    if (!fs.existsSync(scriptPath)) {
      LogService.error('Python script not found', { scriptPath });
      return res.status(500).json({ error: 'DICOM processing script not found' });
    }

    // Check if Python interpreter exists
    if (!fs.existsSync(pythonPath)) {
      LogService.error('Python interpreter not found', { pythonPath });
      return res.status(500).json({ error: 'Python interpreter not found' });
    }

    const pythonProcess = spawn(pythonPath, [scriptPath, filePath], {
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1'
      }
    });

    let pythonData = '';
    let pythonError = '';
    let isCollectingJson = false;
    let jsonLines: string[] = [];

    pythonProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === 'BEGIN_JSON_DATA') {
          isCollectingJson = true;
          jsonLines = []; // Reset JSON lines array
        } else if (trimmedLine === 'END_JSON_DATA') {
          isCollectingJson = false;
          pythonData = jsonLines.join(''); // Join collected JSON lines
        } else if (isCollectingJson && trimmedLine) {
          jsonLines.push(trimmedLine);
        }
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.startsWith('INFO:')) {
        // Handle INFO logs from Python
        LogService.info('Python script:', { message: output.trim() });
      } else {
        // Handle actual errors
        pythonError += output;
        LogService.error('Python script error', { error: output });
      }
    });

    pythonProcess.on('close', (code) => {
      if (hasResponded) return;
      
      if (code !== 0 || pythonError) {
        LogService.error('Python script failed', { code, error: pythonError });
        hasResponded = true;
        return res.status(500).json({ 
          error: 'Error processing DICOM file', 
          details: pythonError 
        });
      }

      try {
        const dicomData = JSON.parse(pythonData);
        
        LogService.info('DICOM file processed successfully', { 
          fileName,
          patientName: dicomData.PatientName 
        });
        
        hasResponded = true;
        res.json({
          ...dicomData,
          filePath: fileName
        });
      } catch (error) {
        if (!hasResponded) {
          LogService.error('Error parsing Python output', { error, pythonData });
          hasResponded = true;
          res.status(500).json({ error: 'Error parsing DICOM data' });
        }
      }
    });

    pythonProcess.on('error', (error) => {
      if (!hasResponded) {
        LogService.error('Failed to start Python process', { error });
        hasResponded = true;
        res.status(500).json({ error: 'Failed to process DICOM file' });
      }
    });

  } catch (error) {
    if (!hasResponded) {
      LogService.error('Error in process-dicom endpoint', { error });
      hasResponded = true;
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

// Route for uploading and processing new DICOM files
router.post('/process-dicom', upload.single('file') as any, (req: Request & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    if (req.body.filePath) {
      const fullPath = path.join(uploadDir, req.body.filePath);
      return processDicomFile(fullPath, req.body.filePath, res);
    }
    return res.status(400).json({ error: 'No file uploaded and no file path provided' });
  }
  return processDicomFile(req.file.path, req.file.filename, res);
});

// Route for processing existing DICOM files
router.get('/process-dicom', (req: Request, res: Response) => {
  const filePath = req.query.filePath as string;
  
  if (!filePath) {
    return res.status(400).json({ error: 'No file path provided' });
  }

  LogService.debug('Processing existing DICOM file', { filePath });
  
  const fullPath = path.join(uploadDir, filePath);
  return processDicomFile(fullPath, filePath, res);
});

// Route for downloading DICOM files
router.get('/download', (req: Request, res: Response) => {
  const filePath = req.query.filePath as string;
  
  if (!filePath) {
    return res.status(400).json({ error: 'No file path provided' });
  }

  const fullPath = path.join(uploadDir, filePath);
  
  LogService.debug('Downloading DICOM file', { filePath, fullPath });

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    LogService.error('File not found', { filePath, fullPath });
    return res.status(404).json({ error: 'File not found' });
  }

  // Set headers for file download
  res.setHeader('Content-Type', 'application/dicom');
  res.setHeader('Content-Disposition', `attachment; filename="${filePath}"`);

  // Stream the file
  const fileStream = fs.createReadStream(fullPath);
  fileStream.pipe(res);

  // Handle errors
  fileStream.on('error', (error) => {
    LogService.error('Error streaming file', { error, filePath });
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error downloading file' });
    }
  });
});

export default router; 