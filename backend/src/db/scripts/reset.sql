-- Drop existing tables in reverse order of creation (due to foreign key constraints)
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Series;
DROP TABLE IF EXISTS Modalities;
DROP TABLE IF EXISTS Studies;
DROP TABLE IF EXISTS Patients;

-- Recreate tables
CREATE TABLE Patients (
  idPatient INT AUTO_INCREMENT PRIMARY KEY,
  PatientName VARCHAR(255) NOT NULL,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Studies (
  idStudy INT AUTO_INCREMENT PRIMARY KEY,
  idPatient INT NOT NULL,
  StudyName VARCHAR(255),
  StudyDate DATE NOT NULL,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPatient) REFERENCES Patients(idPatient)
);

CREATE TABLE Modalities (
  idModality INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL
);

CREATE TABLE Series (
  idSeries INT AUTO_INCREMENT PRIMARY KEY,
  idPatient INT NOT NULL,
  idStudy INT NOT NULL,
  idModality INT NOT NULL,
  SeriesName VARCHAR(255),
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPatient) REFERENCES Patients(idPatient),
  FOREIGN KEY (idStudy) REFERENCES Studies(idStudy),
  FOREIGN KEY (idModality) REFERENCES Modalities(idModality)
);

CREATE TABLE Files (
  idFile INT AUTO_INCREMENT PRIMARY KEY,
  idPatient INT,
  idStudy INT,
  idSeries INT,
  FilePath VARCHAR(255) NOT NULL,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPatient) REFERENCES Patients(idPatient),
  FOREIGN KEY (idStudy) REFERENCES Studies(idStudy),
  FOREIGN KEY (idSeries) REFERENCES Series(idSeries)
); 