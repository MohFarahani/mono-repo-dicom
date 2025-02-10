#!/usr/bin/env python3
import sys
import json
import pydicom
import logging
from datetime import datetime
import numpy as np
import base64
from PIL import Image
import io

# Configure logging to use stderr for logs
logging.basicConfig(
    level=logging.INFO,
    format='INFO:%(name)s:%(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

def normalize_pixels(pixels):
    """Normalize pixel values to 0-255 range."""
    if pixels.dtype != np.uint8:
        min_val = float(pixels.min())
        max_val = float(pixels.max())
        if min_val != max_val:
            pixels = ((pixels - min_val) / (max_val - min_val) * 255).astype(np.uint8)
        else:
            pixels = np.zeros_like(pixels, dtype=np.uint8)
    return pixels

def process_dicom(file_path):
    try:
        logger.info(f"Processing DICOM file: {file_path}")
        
        # Read DICOM file
        ds = pydicom.dcmread(file_path)
        
        # Extract pixel data
        pixels = ds.pixel_array
        pixels = normalize_pixels(pixels)
        
        # Convert to PIL Image
        image = Image.fromarray(pixels)
        
        # Convert to base64
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        # Extract relevant DICOM tags
        data = {
            "PatientName": str(getattr(ds, "PatientName", "Unknown")),
            "StudyDate": str(getattr(ds, "StudyDate", datetime.now().strftime("%Y%m%d"))),
            "StudyDescription": str(getattr(ds, "StudyDescription", "")),
            "SeriesDescription": str(getattr(ds, "SeriesDescription", "")),
            "Modality": str(getattr(ds, "Modality", "Unknown")),
            "image": {
                "data": image_base64,
                "width": pixels.shape[1],
                "height": pixels.shape[0]
            }
        }
        
        logger.info(f"Successfully processed DICOM file for patient: {data['PatientName']}")
        
        # Print a marker followed by JSON data to stdout
        print("BEGIN_JSON_DATA")
        print(json.dumps(data), flush=True)
        print("END_JSON_DATA")
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Error processing DICOM file: {str(e)}")
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "File path argument is required"}), file=sys.stderr)
        sys.exit(1)
        
    process_dicom(sys.argv[1])