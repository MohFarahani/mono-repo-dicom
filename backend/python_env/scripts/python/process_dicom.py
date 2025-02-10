import sys
import json
import numpy as np
from pydicom import dcmread
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName
import base64
from io import BytesIO
from PIL import Image

def getDicomValue(ds, name):
    try:
        value = ds.get(name)
        if value is None:
            return ''
        if isinstance(value, MultiValue):
            return [str(x) for x in value]
        if isinstance(value, PersonName):
            return str(value)
        if isinstance(value, (np.ndarray, list)):
            return [str(x) for x in value]
        if isinstance(value, (np.floating, np.integer)):
            return float(value)
        return str(value)
    except:
        return ''

def process_pixel_data(ds):
    """Process DICOM pixel data and convert to base64 image"""
    try:
        # Get pixel array
        pixel_array = ds.pixel_array
        
        # Apply windowing if available
        try:
            window_center = ds.WindowCenter
            window_width = ds.WindowWidth
            if isinstance(window_center, MultiValue):
                window_center = window_center[0]
            if isinstance(window_width, MultiValue):
                window_width = window_width[0]
        except:
            # If no window information, use min/max of the image
            window_center = (pixel_array.max() + pixel_array.min()) / 2
            window_width = pixel_array.max() - pixel_array.min()

        # Apply rescale intercept if available
        try:
            rescale_intercept = ds.RescaleIntercept
        except:
            rescale_intercept = 0

        # Convert to float and apply rescale intercept
        image = pixel_array.astype(float)
        image += rescale_intercept

        # Apply windowing
        min_value = window_center - window_width // 2
        max_value = window_center + window_width // 2
        image = np.clip(image, min_value, max_value)

        # Normalize to 0-255
        image = ((image - min_value) / (max_value - min_value) * 255).astype(np.uint8)

        # Convert to PIL Image
        img = Image.fromarray(image)

        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return {
            "imageData": img_str,
            "width": ds.Columns,
            "height": ds.Rows
        }
    except Exception as e:
        return {
            "error": f"Image processing failed: {str(e)}",
            "imageData": None,
            "width": 0,
            "height": 0
        }

def convert_dicom(filepath: str) -> dict:
    """
    Convert DICOM file to structured data including image data
    """
    try:
        ds = dcmread(filepath)
        
        # Extract relevant DICOM fields
        patient_name = getDicomValue(ds, 'PatientName')
        study_date = getDicomValue(ds, 'StudyDate')
        study_description = getDicomValue(ds, 'StudyDescription')
        series_description = getDicomValue(ds, 'SeriesDescription')
        modality = getDicomValue(ds, 'Modality')
        
        # Process image data
        image_data = process_pixel_data(ds)
        
        # Format the output to match the database structure
        output_json = {
            "PatientName": patient_name,
            "StudyDate": study_date,
            "StudyDescription": study_description,
            "SeriesDescription": series_description,
            "Modality": modality,
            "filePath": filepath,
            "image": {
                "data": image_data["imageData"],
                "width": image_data["width"],
                "height": image_data["height"]
            }
        }
        
        return output_json
    except Exception as e:
        return {
            "error": str(e),
            "details": str(sys.exc_info())
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            result = {
                "error": f"Invalid arguments. Expected at least 1, got {len(sys.argv) - 1}"
            }
        else:
            filepath = sys.argv[1]
            result = convert_dicom(filepath)
        
        # Ensure proper JSON output
        print(json.dumps(result, ensure_ascii=False, default=str))
        sys.stdout.flush()

    except Exception as e:
        error_result = {
            "error": str(e),
            "traceback": str(sys.exc_info())
        }
        print(json.dumps(error_result, ensure_ascii=False, default=str))
        sys.stdout.flush()