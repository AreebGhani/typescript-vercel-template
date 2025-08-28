import express from 'express';

import { ApiPath } from '@/constants';
import { UserController } from '@/controllers';
import {
  isAuthenticated,
  isActive,
  requiredRoles,
  multerUpload,
  validateCredentials,
} from '@/middlewares';

const router = express.Router();
const { get, post, put } = UserController;

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: The user details.
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID.
 *           example: "66e4e5b789347536b5c4792d"
 *         firstName:
 *           type: string
 *           description: The first name of the user.
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: The last name of the user.
 *           example: "Doe"
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: "johndoe@mail.com"
 *         phone:
 *           type: string
 *           description: The phone number of the user, or `undefined` if not provided.
 *           example: "+1234567890"
 *         image:
 *           type: string
 *           description: The image of the user, or `undefined` if not provided.
 *           example: "https://example.com/users/1726085053896.webp"
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *           description: The role of the user.
 *           example: "user"
 *         status:
 *           type: string
 *           description: The status of the user.
 *           example: "active"
 */

/**
 * @openapi
 * /user/update:
 *   put:
 *     tags:
 *       - User Controller
 *     summary: Update user profile
 *     description: Updates the profile information of the authenticated user. The user must be authenticated to access this endpoint. The endpoint validates that the email and phone number are unique and checks if the uploaded file is present before updating the user details.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: The new email address of the user.
 *                 example: "johndoe@mail.com"
 *               phone:
 *                 type: string
 *                 description: The new phone number of the user.
 *                 example: "+1234567890"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The profile image to be uploaded. That can be string of uploaded image url.
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - image
 *     responses:
 *       200:
 *         description: Successfully updated the user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the profile update was successful.
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. This indicates either a validation error or a missing file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the problem with the request.
 *                   example:
 *                     - "email already exists"
 *                     - "phone number already exists"
 *                     - "invalid first name"
 *                     - "invalid last name"
 *                     - "invalid email or phone number"
 *                     - "file not found"
 *                     - "missing fields: firstName, lastName, email, phone, image"
 *                     - "file not found, please upload a file"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user is not authenticated.
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
 *       404:
 *         description: Not found. The user was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user was not found.
 *                   example: "user not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.put(
  ApiPath.User.Update,
  isAuthenticated,
  isActive,
  multerUpload.single('image'),
  validateCredentials({ type: 'update' }),
  put.Update
);

/**
 * @openapi
 * /user/change-status/{id}:
 *   put:
 *     tags:
 *       - User Controller
 *     summary: Update the status of a user
 *     description: Allows an admin to update the status of a user. The user must be authenticated and have an admin role to access this endpoint.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose status is to be updated.
 *         example: "66e4e5b789347536b5c4792d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the user. `active` or `inactive`
 *                 example: "inactive"
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Successfully updated the user's status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the status update was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "ok"
 *       400:
 *         description: Bad request. Required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating what went wrong.
 *                   example:
 *                     - "user id is required"
 *                     - "status is required"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user is not authenticated.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. The user does not have the required role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user does not have the required role.
 *                   example: "user cannot access this resource"
 *       404:
 *         description: Not found. The user was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user was not found.
 *                   example: "user not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Error occurred
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.put(
  ApiPath.User.ChangeStatus,
  isAuthenticated,
  isActive,
  requiredRoles('admin'),
  put.ChangeStatus
);

/**
 * @openapi
 * /user/all:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     tags:
 *       - User Controller
 *     summary: Retrieve all users
 *     description: Fetches all users by the admin, sorted by creation date in descending order.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 users:
 *                   type: array
 *                   description: Array of user objects.
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. The request does not contain a valid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user needs to log in.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. The user does not have the required role to access this resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed due to insufficient permissions.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user does not have access.
 *                   example: "user cannot access this resource"
 *       404:
 *         description: Not Found. The user does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user was not found.
 *                   example: "user not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.get(ApiPath.User.All, isAuthenticated, isActive, requiredRoles('admin'), get.All);

/**
 * @openapi
 * /user/find/{id}:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     tags:
 *       - User Controller
 *     summary: Retrieve a user by ID
 *     description: Fetches a user's information by their unique ID. The user making the request must be an admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the user to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request. The user ID is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user ID is required.
 *                   example: "user id is required"
 *       401:
 *         description: Unauthorized. The request does not contain a valid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user needs to log in.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. The user does not have the required role to access this resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user's role is insufficient.
 *                   example: "user cannot access this resource"
 *       404:
 *         description: Not Found. The user with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user was not found.
 *                   example: "user not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.get(ApiPath.User.FindById, isAuthenticated, isActive, requiredRoles('admin'), get.FindById);

/**
 * @openapi
 * /user/delete-account:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Request account deletion
 *     description: Submits a request to delete the authenticated user's account. Marks the account as deleted and initiates the deletion process.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason for requesting account deletion.
 *                 example: "I no longer need this account."
 *     responses:
 *       201:
 *         description: Account deletion request successfully submitted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "ok"
 *       400:
 *         description: Bad request. Invalid or missing request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message specifying the issue.
 *                   example: "reason is required"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating authentication is required.
 *                   example: "please login to continue"
 *       403:
 *         description: Forbidden. A deletion request has already been submitted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message specifying the issue.
 *                   example: "delete account request already submitted"
 *       404:
 *         description: Not found. The user was not found in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user was not found.
 *                   example: "user not found"
 *       500:
 *         description: Internal server error. An unknown error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an error occurred.
 *                   example: "an unknown error occurred"
 */
router.post(ApiPath.User.DeleteAccount, isAuthenticated, isActive, post.DeleteAccount);

export default router;
