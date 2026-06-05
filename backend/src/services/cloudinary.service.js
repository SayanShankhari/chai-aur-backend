import { v2 as cloudinary } from "cloudinary";
import fs from 'node:fs';

cloudinary.config ({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!fs.existsSync (localFilePath)) {
			throw new Error (`File not found: ${localFilePath}`);
		}

		const response = await cloudinary.uploader.upload (
			localFilePath
			, { resource_type: 'auto' }
		);

		if (!response) {
			console.error ('Error uploading to Cloudinary:', error);
			throw error;
		}

		console.log ("File uploaded successfully in cloudinary:");
		// console.log (response);
		return response;
	} catch (error) {
		console.error ("Error uploading to Cloudinary:", error);
		// throw error;
		return null;
	} finally {
		fs.unlink (localFilePath);	// remove the locally stored temporary file
	}
}

export const cloudinaryService = { uploadOnCloudinary };