// Layout Constants
export const DRAWER_WIDTH = 240;
export const MOBILE_HEADER_HEIGHT = 64;

// Image Controls
export const MAGNIFIER = {
  DEFAULT_SIZE: 180,
  MIN_MAGNIFICATION: 1.5,
  MAX_MAGNIFICATION: 6,
  STEP: 0.5,
  DEFAULT_MAGNIFICATION: 2
};

// Upload Constants
export const UPLOAD = {
  MAX_FILE_SIZE_MB: 10,
  ACCEPTED_FILE_EXTENSIONS: ['.dcm'],
  DRAG_DROP_TEXT: 'Drag and drop your DICOM files here',
  SELECT_FILES_TEXT: 'or click to select DICOM files (.dcm)'
};

// Table Constants
export const TABLE = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  MIN_HEIGHT: 400,
  ROW_HEIGHT: 52
};

// Scrollbar Styles
export const SCROLLBAR = {
  WIDTH: '8px',
  TRACK_COLOR: '#f1f1f1',
  THUMB_COLOR: '#888',
  THUMB_HOVER_COLOR: '#555',
  BORDER_RADIUS: '4px'
};

// Common Spacing
export const SPACING = {
  PAGE_PADDING: 3,
  GRID_GAP: 2,
  LIST_GAP: 8
};

// Common Border Styles
export const BORDERS = {
  DEFAULT: '1px solid rgba(224, 224, 224, 1)',
  SELECTED: '2px solid #1976d2',
  DIVIDER: '1px solid #e0e0e0'
};

// Common Colors
export const COLORS = {
  BACKGROUND_OVERLAY: 'rgba(255, 255, 255, 0.9)',
  BACKDROP_BLUR: 'blur(4px)'
};

// Image Controls Styles
export const IMAGE_CONTROLS = {
  CONTROL_CONTAINER: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  SLIDER: {
    maxWidth: { sm: 200 },
    width: '100%'
  }
} as const;

// Magnifier Controls Styles
export const MAGNIFIER_CONTROLS = {
  container: {
    display: 'flex',
    alignItems: 'center',
    mb: 1
  },
  spacer: {
    width: 8
  },
  magnifierGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  percentage: {
    fontSize: '0.75rem',
    textAlign: 'center',
    minWidth: '40px',
    height: '1rem',
    color: 'text.secondary',
    fontWeight: 500,
    mx: 1
  }
} as const;
