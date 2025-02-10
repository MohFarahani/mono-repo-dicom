import { DicomData } from './types';
import { getSequelize } from '@/db/connection';
import fs from 'fs';

export const resolvers = {
  Query: {
    getAllDicomFiles: async () => {
      const sequelize = getSequelize();
      const [results] = await sequelize.query(
        `SELECT 
          f.idFile,
          f.idPatient,
          f.idStudy,
          f.idSeries,
          f.FilePath,
          p.PatientName,
          s.StudyDate,
          se.SeriesDescription,
          se.Modality,
          f.CreatedDate,
          f.idFile as id
        FROM Files f
        LEFT JOIN Patients p ON f.idPatient = p.idPatient
        LEFT JOIN Studies s ON f.idStudy = s.idStudy
        LEFT JOIN Series se ON f.idSeries = se.idSeries
        ORDER BY f.CreatedDate DESC`
      );
      return results;
    },
    checkFilePathExists: async (_: any, { filePath }: { filePath: string }) => {
      return fs.existsSync(filePath);
    },
  },
  Mutation: {
    processDicomUpload: async (_: any, { input }: { input: DicomData }) => {
      const sequelize = getSequelize();
      const transaction = await sequelize.transaction();

      try {
        // Insert Patient
        const [patientResults] = await sequelize.query(
          'INSERT INTO Patients (PatientName) VALUES (:patientName)',
          {
            replacements: { patientName: input.PatientName },
            transaction,
          }
        );
        const idPatient = (patientResults as any).insertId;

        // Insert Study
        const [studyResults] = await sequelize.query(
          'INSERT INTO Studies (StudyDate) VALUES (:studyDate)',
          {
            replacements: { studyDate: input.StudyDate },
            transaction,
          }
        );
        const idStudy = (studyResults as any).insertId;

        // Insert Series
        const [seriesResults] = await sequelize.query(
          'INSERT INTO Series (SeriesDescription, Modality) VALUES (:seriesDescription, :modality)',
          {
            replacements: {
              seriesDescription: input.SeriesDescription,
              modality: input.Modality,
            },
            transaction,
          }
        );
        const idSeries = (seriesResults as any).insertId;

        // Insert File
        const [fileResults] = await sequelize.query(
          'INSERT INTO Files (idPatient, idStudy, idSeries, FilePath, CreatedDate) VALUES (:idPatient, :idStudy, :idSeries, :filePath, NOW())',
          {
            replacements: {
              idPatient,
              idStudy,
              idSeries,
              filePath: input.FilePath,
            },
            transaction,
          }
        );
        const idFile = (fileResults as any).insertId;

        await transaction.commit();

        return {
          idFile,
          idPatient,
          idStudy,
          idSeries,
          FilePath: input.FilePath,
          CreatedDate: new Date(),
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
  },
}; 