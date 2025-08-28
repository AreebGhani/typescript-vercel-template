import { promisify } from 'util';
import sharp from 'sharp';
import mammoth from 'mammoth';
import pdf from 'html-pdf';
import { S3, PutObjectCommand, ObjectCannedACL, ListObjectsV2Command, } from '@aws-sdk/client-s3';
import env from '../config/index.js';
import { StatusCode } from '../constants/index.js';
import { ErrorHandler, InternalServerError } from '../utils/index.js';
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
export const s3Client = new S3({
    forcePathStyle: false,
    region: 'sfo3',
    endpoint: env.STORAGE_ENDPOINT,
    credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY_ID,
        secretAccessKey: env.STORAGE_SECRET_KEY_ID,
    },
});
const pdfCreateAsync = promisify((html, options, callback) => {
    pdf.create(html, options).toBuffer(callback);
});
/**
 ** Extracts the file name from a given URL.
 * @param url - The URL string from which to extract the file name.
 * @returns The file name extracted from the URL. If the URL is invalid, returns the original URL string.
 */
export const getFileNameFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        const fullPath = urlObj.pathname;
        return fullPath.startsWith('/') ? fullPath.substring(1) : fullPath;
    }
    catch (err) {
        return url;
    }
};
const getNewFileName = (filename, newExtension) => {
    const dotIndex = filename.lastIndexOf('.');
    const nameWithoutExtension = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
    const currentExtension = dotIndex !== -1 ? filename.substring(dotIndex) : '';
    const finalExtension = newExtension && newExtension.trim() !== '' ? newExtension : currentExtension;
    return nameWithoutExtension + '_' + Date.now() + finalExtension;
};
/**
 ** Deletes a file from the S3 bucket based on the provided URL.
 * @param url - The URL of the file to be deleted.
 * @returns A promise that resolves when the file is successfully deleted.
 * @throws Will log an error message if the deletion fails.
 */
export const deleteFile = async (url) => {
    try {
        const fileName = url.startsWith('http') ? getFileNameFromUrl(url) : url;
        await s3Client.deleteObject({
            Bucket: env.STORAGE_BUCKET_NAME,
            Key: fileName,
        });
    }
    catch (err) {
        const ServerError = InternalServerError(err);
        // eslint-disable-next-line no-console
        console.log(`\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] StorageBucket.DeleteFile(${JSON.stringify({
            status: ServerError.statusCode,
            name: ServerError.name,
            message: ServerError.message,
        }, null, 2)})\n`);
        throw ServerError;
    }
};
/**
 ** Lists all files in the specified S3 bucket.
 * @returns {Promise<string[]>} A promise that resolves to an array of file keys (strings) in the bucket.
 * If an error occurs, the promise resolves to an empty array.
 * @throws {Error} If there is an issue with the S3 client or the bucket name is not provided.
 */
export const listAllFiles = async () => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: env.STORAGE_BUCKET_NAME,
        });
        const response = await s3Client.send(command);
        const files = (response.Contents?.map(file => file.Key).filter((key) => key !== undefined && !key.endsWith('/')) || []).map(file => {
            const fileUrl = `https://${env.STORAGE_BUCKET_NAME}/` + file;
            const encodedFileUrl = encodeURI(fileUrl);
            return getFileNameFromUrl(encodedFileUrl);
        });
        const normalizedFiles = files.map(file => file.startsWith(`${env.STORAGE_BUCKET_NAME}/`)
            ? file.replace(`${env.STORAGE_BUCKET_NAME}/`, '')
            : file);
        return normalizedFiles;
    }
    catch (err) {
        return [];
    }
};
// Function to convert DOCX to PDF
const convertDocxToPdf = async (buffer) => {
    // Convert the DOCX buffer to HTML content
    const { value: html } = await mammoth.convertToHtml({ buffer });
    // Convert the HTML content to PDF and return the PDF as a buffer
    const pdfBuffer = await pdfCreateAsync(html, { format: 'Letter' });
    return pdfBuffer;
};
/**
 ** Uploads a media file to a specified folder in DigitalOcean Spaces.
 * @param {Object} params - The parameters for the upload.
 *   - `file` - The file to be uploaded.
 *   - `folderName` - The name of the folder where the file will be uploaded.
 *   - `next` - The next middleware function.
 * @returns {Promise<Media | undefined>} - A promise that resolves to the uploaded media information or undefined if an error occurs.
 * @throws {ErrorHandler} - Throws an error if the file type is unsupported or if the upload fails.
 */
const uploadMedia = async ({ file, folderName, next, }) => {
    try {
        const mimeType = file.mimetype;
        let convertedBuffer;
        let newContentType;
        let fileExtension = '';
        // Handle different file types
        if (mimeType.startsWith('image/')) {
            if (mimeType === 'image/svg+xml') {
                // If the file is an SVG, no conversion needed
                convertedBuffer = file.buffer;
                newContentType = mimeType;
                fileExtension = '.svg';
            }
            else {
                convertedBuffer = await sharp(file.buffer).webp({ quality: 50 }).toBuffer();
                newContentType = 'image/webp';
                fileExtension = '.webp';
            }
        }
        else if (mimeType.startsWith('video/')) {
            convertedBuffer = file.buffer;
            newContentType = mimeType;
        }
        else if (mimeType.startsWith('audio/')) {
            convertedBuffer = file.buffer;
            newContentType = mimeType;
        }
        else if (mimeType === 'application/pdf') {
            convertedBuffer = file.buffer;
            newContentType = mimeType;
        }
        else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Convert DOCX to PDF
            convertedBuffer = await convertDocxToPdf(file.buffer);
            newContentType = 'application/pdf';
            fileExtension = '.pdf';
        }
        else {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'unsupported file type'));
            return;
        }
        const newFileName = getNewFileName(file.originalname, fileExtension);
        // Upload file
        const params = {
            Bucket: env.STORAGE_BUCKET_NAME,
            Key: `${folderName}/${newFileName}`,
            Body: convertedBuffer,
            ACL: ObjectCannedACL.public_read,
            ContentType: newContentType,
            ContentLength: convertedBuffer.length,
        };
        if (env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log(`\x1B[0;95m[StorageBucket]\x1B[0m [${new Date().toISOString()}] ${JSON.stringify({
                request: {
                    Bucket: params.Bucket,
                    Key: params.Key,
                    ACL: params.ACL,
                    ContentType: params.ContentType,
                    ContentLength: params.ContentLength,
                },
            }, null, 2)}\n`);
        }
        // Upload the file to DigitalOcean Spaces
        try {
            const command = new PutObjectCommand(params);
            const response = await s3Client.send(command);
            if (env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.log(`\x1B[0;95m[StorageBucket]\x1B[0m [${new Date().toISOString()}] ${JSON.stringify({ response }, null, 2)}\n`);
            }
        }
        catch (err) {
            throw InternalServerError(err);
        }
        // Generate the public URL for the uploaded file
        const url = `${env.STORAGE_ENDPOINT}/${env.STORAGE_BUCKET_NAME}/${params.Key}`;
        return {
            fieldname: file.fieldname,
            url,
            type: mimeType.startsWith('image/')
                ? 'image'
                : mimeType.startsWith('video/')
                    ? 'video'
                    : mimeType.startsWith('audio/')
                        ? 'audio'
                        : 'document',
        };
    }
    catch (err) {
        throw InternalServerError(err);
    }
};
export default uploadMedia;
//# sourceMappingURL=upload.js.map