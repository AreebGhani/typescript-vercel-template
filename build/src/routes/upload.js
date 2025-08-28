import express from 'express';
import { ApiPath } from '../constants/index.js';
import { UploadController } from '../controllers/index.js';
import { isAuthenticated, isActive, multerUpload, requiredRoles } from '../middlewares/index.js';
const router = express.Router();
const { get, post, del } = UploadController;
/**
 * @openapi
 * /upload:
 *   post:
 *     tags:
 *       - Upload Controller
 *     summary: Upload files
 *     description: Uploads one or more files to the server. The files are processed and stored in memory. The endpoint supports multiple file uploads and returns the URLs of the uploaded files.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: An array of files to upload.
 *               purpose:
 *                 type: string
 *                 enum: ["profile"]
 *                 description: Specifies the purpose of the uploaded file.
 *             required:
 *               - files
 *               - purpose
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully uploaded the files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the upload was successful.
 *                   example: true
 *                 files:
 *                   type: array
 *                   description: List of uploaded files with their URLs and types.
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://example.com/uploads/file1.jpg"
 *                       type:
 *                         type: string
 *                         enum: ['image', 'video', 'audio', 'document']
 *                         description: The type of media.
 *                         example: "image"
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the specific issue.
 *                   example:
 *                     - "purpose is required"
 *                     - "invalid purpose"
 *                     - "file not found"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user is not authenticated.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. The user's account is inactive.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the re-authentication failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user account is inactive.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.post(ApiPath.Upload.UploadMedia, isAuthenticated, isActive, multerUpload.array('files', 3), post.UploadMedia);
/**
 * @openapi
 * /upload/generate-signed-url:
 *   post:
 *     tags:
 *       - Upload Controller
 *     summary: Generate a signed URL for file upload
 *     description: Generates a presigned URL for uploading files to a DigitalOcean Spaces bucket. Supports specific purposes and file extensions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purpose:
 *                 type: string
 *                 enum: ["profile"]
 *                 description: Specifies the purpose of the uploaded file, which determines the directory structure.
 *               extension:
 *                 type: string
 *                 example: ".png"
 *                 description: The file extension (e.g., jpg, png, pdf).
 *             required:
 *               - purpose
 *               - extension
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated the signed URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signedUrl:
 *                   type: string
 *                   description: A presigned URL for uploading the file.
 *                   example: "https://example.com/images/abcd-1234.jpg"
 *                 publicUrl:
 *                   type: string
 *                   description: The public URL of the uploaded file.
 *                   example: "https://example.com/images/abcd-1234.jpg"
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "purpose and extension are required"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user is not authenticated.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. The user's account is inactive.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the re-authentication failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user account is inactive.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "an unknown error occurred"
 */
router.post(ApiPath.Upload.GenerateSignedUrl, isAuthenticated, isActive, post.GenerateSignedUrl);
/**
 * @openapi
 * /upload/all:
 *   get:
 *     tags:
 *       - Upload Controller
 *     summary: Retrieve all uploaded media files
 *     description: Fetches a list of all media file URLs stored in the system. Only accessible to authenticated and active admin users.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of media file URLs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 urls:
 *                   type: array
 *                   description: A list of media file URLs.
 *                   items:
 *                     type: string
 *                   example:
 *                     - "https://example.bucket.com/images/file1.png"
 *                     - "https://example.bucket.com/documents/file2.pdf"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user is not authenticated.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. The user's account is inactive or does not have the required role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the re-authentication failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating why access is forbidden.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "an unknown error occurred"
 */
router.get(ApiPath.Upload.AllMedia, isAuthenticated, isActive, requiredRoles('admin'), get.AllMedia);
/**
 * @openapi
 * /upload/{url}:
 *   delete:
 *     tags:
 *       - Upload Controller
 *     summary: Delete an uploaded file
 *     description: Deletes a file from the server based on the provided URL. This endpoint removes the file from the storage if the URL is valid.
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL or identifier of the file to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the deletion was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message confirming the deletion.
 *                   example: "ok"
 *       400:
 *         description: Bad request. This indicates that the URL was not provided or is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the deletion failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message explaining the issue.
 *                   example: "url is required"
 *       500:
 *         description: Internal server error. Indicates an unexpected error occurred during the URL generation process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an internal error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message explaining the issue.
 *                   example: "an unknown error occurred"
 */
router.delete(ApiPath.Upload.DeleteMedia, isAuthenticated, isActive, del.DeleteMedia);
export default router;
//# sourceMappingURL=upload.js.map