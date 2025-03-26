// middleware/cloudinary.js
import cloudinary from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',  // Ensure it's for images
    });
    return result.secure_url;  // Return Cloudinary URL of uploaded image
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary: ' + error.message);
  }
};

export default uploadToCloudinary;
