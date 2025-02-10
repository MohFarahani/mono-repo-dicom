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

## Backend Structure

```
backend/
└── src/
    ├── db/                     # Database configuration and models
    │   ├── models/            # Database models (TypeORM entities)
    │   ├── scripts/           # Database initialization scripts
    │   ├── connection.ts      # Database connection setup
    │   ├── config.ts          # Database configuration
    │   └── init.ts           # Database initialization
    │
    ├── graphql/               # GraphQL API implementation
    │   ├── resolvers/        # GraphQL resolvers
    │   │   ├── mutations/    # Mutation resolvers
    │   │   └── queries/      # Query resolvers
    │   ├── schema/           # GraphQL schema definitions
    │   ├── validation/       # Input validation
    │   ├── operations.ts     # GraphQL operations
    │   ├── resolvers.ts      # Resolver configuration
    │   ├── schema.ts         # Schema configuration
    │   └── types.ts          # GraphQL types
    │
    ├── routes/                # REST API routes
    │   └── dicom.ts          # DICOM file handling routes
    │
    ├── types/                 # TypeScript type definitions
    ├── utils/                 # Utility functions
    └── index.ts              # Application entry point
```

### Database Layer
- **Models**: TypeORM entities for:
  - DICOM files
  - Patient information
  - Study metadata
- **Scripts**: SQL scripts for:
  - Database initialization
  - Schema creation
  - Initial data seeding
- **Configuration**: Database connection and setup

### GraphQL API
- **Resolvers**:
  - Mutations for data modifications
  - Queries for data retrieval
  - File upload handling
- **Schema**: 
  - Type definitions
  - Query definitions
  - Mutation definitions
- **Validation**: Input validation rules
- **Operations**: Predefined GraphQL operations

### REST API Routes
- DICOM file upload endpoints
- File processing routes
- Static file serving

### Core Features
- DICOM file processing and storage
- Patient and study data management
- GraphQL API for frontend communication
- File system operations for DICOM storage
- Database operations for metadata storage


## Frontend Structure

```
next/
└── src/
    ├── app/                    # Next.js 13+ app directory (routes)
    │   ├── preview/           # DICOM preview functionality
    │   │   ├── page.tsx      # Single preview page
    │   │   └── multi/        # Multi-image preview
    │   ├── upload/           # File upload functionality
    │   │   └── page.tsx      # Upload page
    │   ├── home/            # Home page
    │   │   └── page.tsx     # Home page content
    │   ├── layout.tsx       # Root layout component
    │   └── theme.ts         # Theme configuration
    │
    ├── components/           # Reusable React components
    │   ├── DicomViewer/     # DICOM image viewing
    │   │   ├── index.tsx    # Main viewer component
    │   │   └── controls.tsx # Viewer controls
    │   ├── DicomTable/      # DICOM metadata table
    │   ├── ImagePreviewList/ # Image preview grid
    │   ├── DicomImageList/  # DICOM image listing
    │   ├── DicomPreviewLayout/ # Preview layout
    │   ├── Table/          # Base table component
    │   ├── TwoColumnLayout/ # Layout component
    │   ├── Upload.tsx      # Upload component
    │   └── ErrorDisplay.tsx # Error handling
    │
    ├── hooks/               # Custom React hooks
    │   ├── useDicomData.ts     # DICOM data management
    │   ├── useDicomUpload.ts   # File upload logic
    │   ├── useGetAllDicomFiles.ts # File fetching
    │   └── useDicomViewer.ts   # Viewer state management
    │
    ├── constants/           # Application constants
    │   ├── ui.ts           # UI-related constants
    │   └── routes.ts       # Route definitions
    │
    └── graphql/            # GraphQL integration
        ├── queries/        # GraphQL queries
        ├── mutations/      # GraphQL mutations
        └── schema.ts       # GraphQL types

```

### Page Components
- **Preview Pages**:
  - Single image preview with controls
  - Multi-image comparison view
  - Metadata display
- **Upload Page**:
  - Drag-and-drop file upload
  - Upload progress tracking
  - File validation
- **Home Page**:
  - Navigation hub
  - Recent files display
  - Quick actions

### Core Components
- **DicomViewer**:
  - Image rendering
  - Zoom and pan controls
  - Window/level adjustment
  - Measurement tools
- **Data Display**:
  - DICOM metadata tables
  - Image preview grids
  - Study information
- **Layout Components**:
  - Two-column layouts
  - Responsive containers
  - Error boundaries

### Custom Hooks
- **Data Management**:
  - `useDicomData`: DICOM metadata handling
  - `useDicomUpload`: File upload state and operations
  - `useGetAllDicomFiles`: File listing and pagination
  - `useDicomViewer`: Viewer state and interactions

### Constants and Configuration
- **UI Constants**:
  - Theme definitions
  - Layout measurements
  - Color schemes
- **Route Definitions**:
  - Page routes
  - API endpoints
  - Navigation paths

### GraphQL Integration
- **Queries**:
  - File metadata retrieval
  - Study information
  - Patient data
- **Mutations**:
  - File uploads
  - Metadata updates
  - Study management

### Key Features
- Server-side rendering (SSR)
- Client-side navigation
- Real-time updates
- Responsive design
- Error handling
- TypeScript type safety

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
docker-compose up --build -d
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


