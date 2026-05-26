import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config ({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!fs.existsSync(localFilePath)) {
			throw new Error(`File not found: ${localFilePath}`);
		}

		const response = await cloudinary.uploader.upload (localFilePath, { resource_type: 'auto' })
			.then ((response) => {
				console.log('File uploaded successfully in cloudinary:', response);
			})
			.catch ((error) => {
				console.error('Error uploading to Cloudinary:', error);
				throw error;
			});

		return response;
	} catch (error) {
		console.error ('Error uploading to Cloudinary:', error);
		fs.unlinkSync (localFilePath); // Clean up the local temporary file
		throw error;
	}
}

export { uploadOnCloudinary };