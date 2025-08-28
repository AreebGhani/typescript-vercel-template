import express from 'express';
import { ApiPath } from '../constants/index.js';
import { AuthController } from '../controllers/index.js';
import { isAuthenticated, isActive, validateCredentials } from '../middlewares/index.js';
const router = express.Router();
const { get, post, put } = AuthController;
/**
 * @openapi
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *   schemas:
 *     Otp:
 *       type: object
 *       description: The otp details.
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the OTP record.
 *           example: "60c72b2f9b1e8f001f2d3b59"
 *         otp:
 *           type: string
 *           description: The OTP value.
 *           example: "123456"
 *         email:
 *           type: string
 *           description: The email associated with the OTP.
 *           example: "johndoe@mail.com"
 *         phone:
 *           type: string
 *           description: The phone number associated with the OTP.
 *           example: "+1234567890"
 *         expiryTime:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the OTP expires.
 *           example: "2023-09-17T00:00:00Z"
 *         resendAttempts:
 *           type: integer
 *           description: The number of times the OTP has been resent.
 *           example: 1
 *         lastOtpSent:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the last OTP was sent.
 *           example: "2023-09-17T00:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the OTP record was created.
 *           example: "2023-09-17T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the OTP record was last updated.
 *           example: "2023-09-17T00:00:00Z"
 */
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth Controller
 *     summary: Register a new user and send OTP
 *     description: Registers a new user, performs validation, and sends a one-time passcode (OTP) via email. Validation ensures all required fields are present and valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 description: The email address of the user.
 *                 example: "johndoe@mail.com"
 *               phone:
 *                 type: string
 *                 description: The phone number of the user.
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: "johnDoe123"
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *     responses:
 *       200:
 *         description: Successfully registered the user and sent OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the OTP was sent successfully.
 *                   example: true
 *                 otp:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: User email that have saved in the session.
 *                       example: "johndoe@mail.com"
 *                     phone:
 *                       type: string
 *                       description: User phone number that have saved in the session.
 *                       example: "+1234567890"
 *                     expiryTime:
 *                       type: integer
 *                       description: The expiry time of the OTP in Unix timestamp format.
 *                       example: 1631654400000
 *       400:
 *         description: Bad request. Contains validation errors or other issues with the provided data.
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
 *                     - "invalid email"
 *                     - "invalid phone number"
 *                     - "invalid first name"
 *                     - "invalid last name"
 *                     - "password length should be greater than 8"
 *                     - "invalid email or phone number"
 *                     - "missing fields: firstName, lastName, email, phone, password"
 *       429:
 *         description: Too many requests. Rate limit exceeded.
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
 *                   description: Error message indicating that the rate limit has been exceeded.
 *                   example: "please wait 60 seconds before resending otp"
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
router.post(ApiPath.Auth.Register, validateCredentials({ type: 'register' }), post.Register);
/**
 * @openapi
 * /auth/resend-otp:
 *   get:
 *     tags:
 *       - Auth Controller
 *     summary: Resend OTP to the user
 *     description: Resends a one-time passcode (OTP) to the user if their session is still valid. The OTP is sent to the email associated with the user session.
 *     parameters:
 *       - in: query
 *         name: reset
 *         schema:
 *           type: string
 *         required: true
 *         description: Indicates if the OTP is for a password reset (true) or a new user registration (false).
 *         example: "false"
 *     responses:
 *       200:
 *         description: Successfully resent the OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the OTP was sent successfully.
 *                   example: true
 *                 otp:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: User email that have saved in the session.
 *                       example: "johndoe@mail.com"
 *                     phone:
 *                       type: string
 *                       description: User phone number that have saved in the session.
 *                       example: "+1234567890"
 *                     expiryTime:
 *                       type: integer
 *                       description: The expiry time of the OTP in Unix timestamp format.
 *                       example: 1631654400000
 *       400:
 *         description: Bad request. The session has expired or is invalid.
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
 *                   description: Error message indicating the issue with the request.
 *                   example: "session expired"
 *       429:
 *         description: Too many requests. Rate limit exceeded.
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
 *                   description: Error message indicating that the rate limit has been exceeded.
 *                   example: "please wait 60 seconds before resending otp"
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
router.get(ApiPath.Auth.ResendOtp, get.ResendOtp);
/**
 * @openapi
 * /auth/otp-status:
 *   get:
 *     tags:
 *       - Auth Controller
 *     summary: Retrieve the status of the OTP for the user
 *     description: Retrieves the current status of the OTP, including its expiry time, remaining resend attempts, and whether the OTP can be sent again. The status is based on the user's session and OTP data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the OTP status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfully retrieved the OTP status
 *                   example: true
 *                 otp:
 *                   type: object
 *                   properties:
 *                     expiryTime:
 *                       type: integer
 *                       description: The expiry time of the OTP in Unix timestamp format. Returns 0 if no OTP data is found.
 *                       example: 1631654400000
 *                     message:
 *                       type: string
 *                       description: A message indicating the status of the OTP request.
 *                       example: "otp can be sent"
 *                     attempts:
 *                       type: integer
 *                       description: The number of resend attempts made for the OTP.
 *                       example: 1
 *       400:
 *         description: Bad request. The session has expired or is invalid.
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
 *                   description: Error message indicating the issue with the request.
 *                   example: "session expired"
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
router.get(ApiPath.Auth.OtpStatus, get.OtpStatus);
/**
 * @openapi
 * /auth/verify:
 *   post:
 *     tags:
 *       - Auth Controller
 *     summary: Verify the OTP for password reset or register a new user
 *     description: Verifies the provided OTP for either password reset or new user registration. If the OTP is valid and the request is for registration, a new user is created and a JWT token is returned. If the OTP is for a password reset, it allows the user to proceed with the reset process. This endpoint ensures OTP validity and checks user existence before proceeding.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: number
 *                 description: The OTP provided by the user for verification.
 *                 example: 123456
 *               reset:
 *                 type: boolean
 *                 description: Indicates if the OTP is for a password reset (true) or a new user registration (false).
 *                 example: true
 *             required:
 *               - reset
 *     responses:
 *       200:
 *         description: Successfully verified the OTP and stored user details in the session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the OTP verification was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: The OTP was verified.
 *                   example: "ok"
 *       201:
 *         description: Successfully verified the OTP and registered the user. A JWT token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the registration and OTP verification were successful.
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: The JWT token for the authenticated user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Bad request. The OTP is invalid, expired, or the user already exists.
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
 *                   description: Error message indicating the issue with OTP verification or user registration.
 *                   example:
 *                     - "invalid passcode"
 *                     - "otp has expired"
 *                     - "session expired"
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
router.post(ApiPath.Auth.Verify, post.Verify);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth Controller
 *     summary: Log in a user
 *     description: Authenticates a user by their email or phone number and password. If the credentials are valid, a JWT token is generated and returned. This endpoint requires either an email or phone number along with a password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user. One of email or phone is required.
 *                 example: "johndoe@mail.com"
 *               phone:
 *                 type: string
 *                 description: The phone number of the user. One of email or phone is required.
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password123"
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in and a JWT token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the login was successful.
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: The JWT token for the authenticated user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Bad request. Indicates invalid credentials or missing fields.
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
 *                   description: Error message indicating the issue with login.
 *                   example:
 *                     - "email doesn't exist"
 *                     - "phone doesn't exist"
 *                     - "password length should be greater than 8"
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
router.post(ApiPath.Auth.Login, validateCredentials({ type: 'login' }), post.Login);
/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth Controller
 *     summary: Initiate the password reset process for a user
 *     description: Initiates a password reset process by sending an OTP to the user's registered email or phone number. Either email or phone must be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user. One of email or phone is required.
 *                 example: "johndoe@mail.com"
 *               phone:
 *                 type: string
 *                 description: The phone number of the user. One of email or phone is required.
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Successfully initiated the password reset process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the OTP was sent successfully.
 *                   example: true
 *                 otp:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: User email that have saved in the session.
 *                       example: "johndoe@mail.com"
 *                     phone:
 *                       type: string
 *                       description: User phone number that have saved in the session.
 *                       example: "+1234567890"
 *                     expiryTime:
 *                       type: integer
 *                       description: The expiry time of the OTP in Unix timestamp format.
 *                       example: 1631654400000
 *       400:
 *         description: Bad request. Indicates missing or invalid input fields.
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
 *                   description: Error message indicating the issue with the input.
 *                   example: "email doesn't exist"
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
 *       429:
 *         description: Too many requests. Rate limit exceeded.
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
 *                   description: Error message indicating that the rate limit has been exceeded.
 *                   example: "please wait 60 seconds before resending otp"
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
router.post(ApiPath.Auth.ForgotPassword, validateCredentials({ type: 'forgot' }), post.ForgotPassword);
/**
 * @openapi
 * /auth/update-password:
 *   put:
 *     tags:
 *       - Auth Controller
 *     summary: Update the user's password
 *     description: Allows the user to update their password using email or phone for identification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password to be set for the user.
 *                 example: "newPassword123"
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the password update was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Confirmation message of the password update.
 *                   example: "ok"
 *       400:
 *         description: Bad request. Indicates missing or invalid fields, session expiration, or other validation issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the operation failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message detailing the reason for the failure.
 *                   example:
 *                     - "password is required"
 *                     - "session expired"
 *                     - "email doesn't exist"
 *                     - "phone number doesn't exist"
 *                     - "email or phone number is required"
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
 *         description: Internal server error. An unknown error occurred during password update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an internal server error occurred.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.put(ApiPath.Auth.UpdatePassword, validateCredentials({ type: 'reset' }), put.UpdatePassword);
/**
 * @openapi
 * /auth/logout:
 *   get:
 *     tags:
 *       - Auth Controller
 *     summary: Logout the user
 *     description: Logs out the user by clearing the JWT token cookie. The user will no longer be authenticated after this operation.
 *     responses:
 *       200:
 *         description: Successfully logged out the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the logout operation was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Confirmation message for the logout operation.
 *                   example: "ok"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the logout operation was unsuccessful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.get(ApiPath.Auth.Logout, get.Logout);
/**
 * @openapi
 * /auth/reauthenticate:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     tags:
 *       - Auth Controller
 *     summary: Re-authenticate the user and issue a new token
 *     description: Validates the user based on the current session and issues a new JWT token if the user is authenticated.
 *     responses:
 *       200:
 *         description: Successfully re-authenticated the user and issued a new token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the re-authentication was successful.
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: The JWT token for the authenticated user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Bad request. User not found in the system.
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
 *                   description: Error message indicating that the user was not found.
 *                   example: "user not found"
 *       401:
 *         description: Unauthorized. The request does not contain a valid JWT token.
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
 *                   description: Error message indicating that the user needs to log in.
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
 *         description: Internal server error.
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
 *                   description: Error message indicating an unknown error occurred.
 *                   example: "an unknown error occurred"
 */
router.get(ApiPath.Auth.Reauthenticate, isAuthenticated, isActive, get.ReAuthenticate);
export default router;
//# sourceMappingURL=auth.js.map