import { type NextFunction } from 'express';
import { S3 } from '@aws-sdk/client-s3';
import type { Media } from '../types/index.js';
/**
 ** An instance of the AWS S3 client configured with custom settings.
 * @constant
 * @type {S3}
 * @property {boolean} forcePathStyle - Indicates whether to force path style URLs for S3 objects.
 * @property {string} region - The region where the S3 bucket is located.
 * @property {string} endpoint - The custom endpoint for the S3 service.
 * @property {Object} credentials - The credentials for accessing the S3 service.
 * @property {string} credentials.accessKeyId - The access key ID for the S3 service.
 * @property {string} credentials.secretAccessKey - The secret access key for the S3 service.
 */
export declare const s3Client: S3;
/**
 ** Extracts the file name from a given URL.
 * @param url - The URL string from which to extract the file name.
 * @returns The file name extracted from the URL. If the URL is invalid, returns the original URL string.
 */
export declare const getFileNameFromUrl: (url: string) => string;
/**
 ** Deletes a file from the S3 bucket based on the provided URL.
 * @param url - The URL of the file to be deleted.
 * @returns A promise that resolves when the file is successfully deleted.
 * @throws Will log an error message if the deletion fails.
 */
export declare const deleteFile: (url: string) => Promise<void>;
/**
 ** Lists all files in the specified S3 bucket.
 * @returns {Promise<string[]>} A promise that resolves to an array of file keys (strings) in the bucket.
 * If an error occurs, the promise resolves to an empty array.
 * @throws {Error} If there is an issue with the S3 client or the bucket name is not provided.
 */
export declare const listAllFiles: () => Promise<string[]>;
/**
 ** Uploads a media file to a specified folder in DigitalOcean Spaces.
 * @param {Object} params - The parameters for the upload.
 *   - `file` - The file to be uploaded.
 *   - `folderName` - The name of the folder where the file will be uploaded.
 *   - `next` - The next middleware function.
 * @returns {Promise<Media | undefined>} - A promise that resolves to the uploaded media information or undefined if an error occurs.
 * @throws {ErrorHandler} - Throws an error if the file type is unsupported or if the upload fails.
 */
declare const uploadMedia: ({ file, folderName, next, }: {
    file: Express.Multer.File;
    folderName: string;
    next: NextFunction;
}) => Promise<Media | undefined>;
export default uploadMedia;
