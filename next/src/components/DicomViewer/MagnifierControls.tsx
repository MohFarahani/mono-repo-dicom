import  { memo, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { MAGNIFIER, MAGNIFIER_CONTROLS } from '@/constants/ui';

interface MagnifierControlsProps {
  magnifierEnabled: boolean;
  magnification: number;
  onMagnifierToggle: (enabled: boolean) => void;
  onMagnificationChange: (value: number) => void;
}

export const MagnifierControls = memo(({
  magnifierEnabled,
  magnification,
  onMagnifierToggle,
  onMagnificationChange
}: MagnifierControlsProps) => {
  const handleZoomOut = useCallback(() => {
    onMagnificationChange(Math.max(magnification - MAGNIFIER.STEP, MAGNIFIER.MIN_MAGNIFICATION));
  }, [magnification, onMagnificationChange]);

  const handleZoomIn = useCallback(() => {
    onMagnificationChange(Math.min(magnification + MAGNIFIER.STEP, MAGNIFIER.MAX_MAGNIFICATION));
  }, [magnification, onMagnificationChange]);

  return (
    <Box sx={MAGNIFIER_CONTROLS.container}>
      <Tooltip title="Zoom Out">
        <span>
          <IconButton 
            size="small"
            onClick={handleZoomOut}
            disabled={!magnifierEnabled}
            aria-label="Zoom out"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Box sx={MAGNIFIER_CONTROLS.spacer} />

      <Box sx={MAGNIFIER_CONTROLS.magnifierGroup}>
        <Tooltip title="Toggle Magnifier">
          <IconButton 
            onClick={() => onMagnifierToggle(true)}
            color={magnifierEnabled ? "primary" : "default"}
            aria-label="Toggle magnifier"
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>

        {magnifierEnabled && (
          <Box sx={MAGNIFIER_CONTROLS.percentage}>
            {(magnification * 100).toFixed(0)}%
          </Box>
        )}
      </Box>

      <Box sx={MAGNIFIER_CONTROLS.spacer} />

      <Tooltip title="Zoom In">
        <span>
          <IconButton 
            size="small"
            onClick={handleZoomIn}
            disabled={!magnifierEnabled}
            aria-label="Zoom in"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
});

MagnifierControls.displayName = 'MagnifierControls';
