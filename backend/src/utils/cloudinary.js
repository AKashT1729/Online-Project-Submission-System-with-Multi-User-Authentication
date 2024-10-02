// Define Cloudinary configuration using environment variables
// Import necessary modules
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NANE, // Cloud name from environment variables
  api_key: process.env.API_KEY_CLOUDINARY, // API key from environment variables
  api_secret: process.env.API_SECRET_CLOUDINARY, // API secret from environment variables
});

// Define an asynchronous function to upload files to Cloudinary
const uploadOnCloudinary = async (localSrsFile) => {
  try {
    if (!localSrsFile) return null;

    console.log(`Uploading file in cloudinary: ${localSrsFile}`);
     console.log(typeof(localSrsFile));
      
    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localSrsFile, {
      resource_type: "auto",
      timeout: 60000, // Adjust timeout as needed
    });

    console.log("File successfully uploaded to Cloudinary:", uploadResult.url);

    // After successful upload, delete the local file
    fs.unlinkSync(localSrsFile);
    return uploadResult.url;
  } catch (error) {
    // If an error occurs, log it
    console.error("Error during file upload:", error.message);

    // Ensure the local file is deleted even in case of an error
    if (fs.existsSync(localSrsFile)) {
      fs.unlinkSync(localSrsFile);
    }

    return null; // Return null in case of failure
  }
};

// Export the uploadOnCloudinary function as the default export
export { uploadOnCloudinary };
