import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { AppError } from '@/utils/errorHandling';
import { config } from '@/config';
import { LogService } from '@/utils/logging';
import { BaseService } from './BaseService';

const execAsync = promisify(exec);

export class PythonService extends BaseService {
  static async verifyEnvironment(): Promise<void> {
    try {
      await fs.access(config.python.pythonPath);
      const checkNumpy = `${config.python.pythonPath} -c "import numpy; print('numpy version:', numpy.__version__)"`;
      const { stdout: numpyVersion } = await execAsync(checkNumpy);
      LogService.debug('Numpy check', { version: numpyVersion.trim() });
    } catch (error) {
      LogService.error('Python environment verification failed', error);
      throw new AppError('Python environment verification failed', 'PYTHON_ENV_ERROR', 500);
    }
  }

  static async executeScript(filePath: string) {
    const command = `${config.python.pythonPath} "${config.python.scriptPath}" "${filePath}" "json" "False"`;
    
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        PYTHONPATH: path.join(config.python.venvPath, 'lib', 'python3.9', 'site-packages'),
      }
    });

    if (stderr) {
      LogService.error('Python stderr', stderr);
    }

    return JSON.parse(stdout);
  }
} 