import path from 'path';

export const config = {
  python: {
    venvPath: path.join(process.cwd(), 'python_env', 'venv'),
    scriptPath: path.join(process.cwd(), 'python_env', 'scripts', 'python', 'process_dicom.py'),
    pythonPath: path.join(process.cwd(), 'python_env', 'venv', 'bin', 'python3'),
  },
  paths: {
    dicomFolder: path.join(process.cwd(), 'dicom_files'),
  }
}; 