import { useState, useRef, MouseEvent } from 'react';
import { Box} from '@mui/material';


interface MagnifierProps {
  src: string;
  // width: number;
  // height: number;
  enabled: boolean;
  magnification: number;
  magnifierSize?: number;
  onClick: () => void;
}

export const Magnifier = ({
  src,
  // width,
  // height,
  enabled,
  magnification,
  magnifierSize = 150,
  onClick,
}: MagnifierProps) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!imgRef.current || !enabled) return;

    const elem = imgRef.current;
    const { left, top } = elem.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMagnifierPosition({ x, y });
  };

  const handleClick = () => {
    if (!enabled) {
      onClick();
    }
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        cursor: enabled ? 'none' : 'pointer',
      }}
      onClick={handleClick}
      onMouseEnter={() => enabled && setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="DICOM Image"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      
      {enabled && showMagnifier && (
        <Box
          sx={{
            position: 'absolute',
            left: magnifierPosition.x - magnifierSize / 2,
            top: magnifierPosition.y - magnifierSize / 2,
            width: magnifierSize,
            height: magnifierSize,
            border: '2px solid #fff',
            borderRadius: '50%',
            pointerEvents: 'none',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Magnified"
            style={{
              position: 'absolute',
              left: `${-magnifierPosition.x * magnification + magnifierSize / 2}px`,
              top: `${-magnifierPosition.y * magnification + magnifierSize / 2}px`,
              transform: `scale(${magnification})`,
              transformOrigin: 'left top',
            }}
          />
        </Box>
      )}
    </Box>
  );
}; 