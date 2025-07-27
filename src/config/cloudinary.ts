import { v2 as cloudinary } from 'cloudinary';
import vars from './vars.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: vars.cloudinary.cloudName,
    api_key: vars.cloudinary.apiKey,
    api_secret: vars.cloudinary.apiSecret,
});

export default cloudinary;

// Helper function to upload image to Cloudinary
export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
    try {
        // Convert buffer to base64
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'falcon-announcements',
            resource_type: 'auto',
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}; 