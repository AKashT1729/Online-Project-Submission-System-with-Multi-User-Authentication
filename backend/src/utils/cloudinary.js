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
    // Check if localFilePath is provided
    console.log(`in cloudinary ${localSrsFile}`);
    
    if (!localSrsFile) return null;

    // Upload the file to Cloudinary and get the upload result
    const uploadResult = await cloudinary.uploader.upload(localSrsFile, {
      resource_type: "auto", // Resource type for upload (auto-detect)
    });
  //  console.log("File uploaded on Cloudinary: ", uploadResult.url);
    // Log the upload success and return the uploaded file URL
    // console.log("File uploaded on Cloudinary: ", uploadResult.url);
    fs.unlinkSync(localSrsFile);
    return uploadResult.url;
  } catch (error) {
    // Handle upload errors
    fs.unlinkSync(localSrsFile); // Remove the locally saved temporary file as the upload failed
    console.log(error);
    return null; // Return null in case of upload failure
  }
};

// Export the uploadOnCloudinary function as the default export
export { uploadOnCloudinary };
