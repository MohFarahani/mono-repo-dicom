# DICOM Viewer Application

This is a full-stack application for viewing and managing DICOM medical images. The application consists of a Next.js frontend, Node.js backend with GraphQL, and MySQL database, all containerized using Docker.

## Project Structure

```
.
├── backend/                      # Backend Node.js application
│   └── src/
│       ├── db/                  # Database models and scripts
│       ├── graphql/             # GraphQL schemas and resolvers
│       ├── routes/              # REST API routes
│       └── python_env/          # Python environment for DICOM processing
├── next/                        # Next.js frontend application
│   └── src/
│       ├── app/                # Next.js 13+ app directory
│       │   ├── preview/       # DICOM preview pages
│       │   ├── upload/        # File upload page
│       │   ├── home/         # Home page
│       │   ├── layout.tsx    # Root layout
│       │   └── theme.ts      # Theme configuration
│       │
│       ├── components/        # React components
│       │   ├── DicomViewer/  # DICOM image viewer component
│       │   ├── DicomTable/   # DICOM files table
│       │   ├── ImagePreviewList/  # Image preview grid
│       │   ├── DicomImageList/    # DICOM image list
│       │   ├── DicomPreviewLayout/  # Preview layout
│       │   ├── Table/        # Reusable table component
│       │   ├── TwoColumnLayout/  # Layout component
│       │   ├── Upload.tsx    # File upload component
│       │   └── ErrorDisplay.tsx  # Error handling
│       │
│       ├── hooks/            # Custom React hooks
│       │   ├── useDicomData.ts      # DICOM data management
│       │   ├── useDicomUpload.ts    # File upload logic
│       │   ├── useGetAllDicomFiles.ts # Fetch all DICOM files
│       │   └── useDicomViewer.ts    # Viewer state management
│       │
│       ├── constants/        # Application constants
│       │   ├── ui.ts        # UI-related constants
│       │   └── routes.ts    # Application routes
│       │
│       └── graphql/          # GraphQL configuration
├── dicom_files/               # Directory for storing DICOM files
└── scripts/                   # Utility scripts
```

## Key Components

### Pages
- `/`: Home page with main navigation
- `/preview`: DICOM image preview page
- `/upload`: File upload interface

### Components
- `DicomViewer`: Main DICOM image viewing component
- `DicomTable`: Table displaying DICOM file metadata
- `ImagePreviewList`: Grid view of DICOM image previews
- `Upload`: File upload interface with drag-and-drop
- `ErrorDisplay`: Error handling and display component

### Custom Hooks
- `useDicomData`: Manages DICOM file data and metadata
- `useDicomUpload`: Handles file upload operations
- `useGetAllDicomFiles`: Fetches all available DICOM files
- `useDicomViewer`: Manages viewer state and interactions

### Constants
- `ui.ts`: UI-related constants (styles, themes, layouts)
- `routes.ts`: Application route definitions

### Features
- DICOM file upload and processing
- Image preview and manipulation
- Metadata extraction and display
- Multi-image viewing
- Error handling and validation

## Frontend Architecture

The frontend is built using Next.js 13+ with the following key features:

### Key Directories

- `src/app/`: Contains the application routes and pages using Next.js 13+ app directory structure
- `src/components/`: Reusable React components including:
  - DICOM image viewers
  - Navigation components
  - Form components
  - UI elements
- `src/graphql/`: GraphQL related files:
  - Queries and mutations
  - GraphQL client configuration
  - Type definitions
- `src/providers/`: React context providers for:
  - Authentication
  - Theme
  - Global state management
- `src/hooks/`: Custom React hooks for:
  - Data fetching
  - UI state management
  - DICOM file handling
- `src/utils/`: Utility functions for:
  - Data transformation
  - File handling
  - Date formatting
- `src/types/`: TypeScript type definitions
- `src/constants/`: Application-wide constants
- `src/middleware/`: Next.js middleware for:
  - Authentication
  - Request handling
  - Response transformation

### Key Features

- Modern React with TypeScript
- Server-side rendering (SSR) with Next.js
- GraphQL integration for data fetching
- Responsive design
- DICOM image viewing capabilities
- Real-time updates
- Client-side routing
- Type-safe development with TypeScript

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.9+ (for DICOM processing)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create necessary directories:
```bash
mkdir -p dicom_files
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend GraphQL API: http://localhost:4000/graphql
- MySQL Database: localhost:3306

## Services

### Frontend (Next.js)
- Modern React-based web application
- Runs on port 3000
- Communicates with backend via GraphQL
- Features DICOM image preview and management

### Backend (Node.js)
- GraphQL API server
- DICOM file processing capabilities
- REST endpoints for file uploads
- Runs on port 4000

### Database (MySQL)
- Stores metadata about DICOM files and patients
- Runs on port 3306
- Initialized with required schemas on startup

## Development

For development, you can use the development Docker Compose file:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This configuration includes:
- Hot-reloading for both frontend and backend
- Volume mounts for local development
- Development-specific environment variables

## Database Management

To reset the database:
```bash
./scripts/reset-db.sh
```

## Environment Variables

The application uses the following environment variables (already configured in docker-compose):

### Backend
- `NODE_ENV`: Application environment
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASS`: Database password
- `FRONTEND_URL`: Frontend application URL
- `DICOM_FILES_PATH`: Path to store DICOM files

### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: Backend GraphQL API URL
- `NEXT_PUBLIC_BACKEND_HOST`: Backend host
- Other database-related variables for direct DB access if needed


