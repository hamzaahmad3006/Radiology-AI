import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True
)

class CloudinaryService:
    @staticmethod
    def upload_image(file_path: str, folder: str = "radiology_scans"):
        """
        Uploads an image to Cloudinary and returns the secure URL.
        """
        try:
            upload_result = cloudinary.uploader.upload(
                file_path,
                folder=folder,
                resource_type="image"
            )
            return upload_result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary Upload Error: {e}")
            return None

    @staticmethod
    def delete_image(image_url: str):
        """
        Deletes an image from Cloudinary using its public ID.
        Note: Public ID is derived from the URL.
        """
        try:
            # Extract public ID from URL (e.g., https://res.cloudinary.com/cloud/image/upload/v1/folder/id.jpg)
            # This is a simple implementation, might need refinement
            public_id = image_url.split("/")[-1].split(".")[0]
            # If folder is used, public ID should include it: folder/id
            if "radiology_scans" in image_url:
                public_id = f"radiology_scans/{public_id}"
            
            cloudinary.uploader.destroy(public_id)
            return True
        except Exception as e:
            print(f"Cloudinary Delete Error: {e}")
            return False
