import multer from 'multer';
/**
 ** Middleware configuration for handling file uploads using multer.
 * This configuration sets the following options:
 * - `limits.fileSize`: Maximum file size allowed for upload is 50MB.
 * - `storage`: Files are stored in memory.
 * @constant {multer.Multer} multerUpload - The configured multer instance for handling file uploads.
 */
const multerUpload = multer({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    storage: multer.memoryStorage(), // Store the files in memory
});
export default multerUpload;
//# sourceMappingURL=multer.js.map