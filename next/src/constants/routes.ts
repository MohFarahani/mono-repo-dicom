export const ROUTES = {
  HOME: {
    ROOT: '/home',
    PREVIEW: '/home/preview',
  },
  PREVIEW: {
    ROOT: '/preview',
    MULTI: '/preview/multi',
  },
  UPLOAD: '/upload',
  API: {
    PROCESS_DICOM: '/api/process-dicom',
    DOWNLOAD: '/api/download',
    GRAPHQL: '/api/graphql',
  },
} as const; 