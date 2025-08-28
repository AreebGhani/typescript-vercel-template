import express from 'express';

import { ApiPath } from '@/constants';
import { isAuthenticated, isActive, requiredRoles } from '@/middlewares';
import { DocsController } from '@/controllers';

const router = express.Router();
const { get } = DocsController;

/**
 * @openapi
 * /docs:
 *   get:
 *     tags:
 *       - Docs Controller
 *     summary: Serve API documentation
 *     description: Returns the HTML page containing the interactive API documentation (Swagger UI) generated from the server's OpenAPI specification.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully served the API documentation page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html>...</html>"
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
 *         description: Forbidden. The user is not authorized or account is inactive.
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
 *                   description: Error message indicating the user cannot update this tenant.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unknown error occurred.
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
router.get(ApiPath.Docs.Swagger, isAuthenticated, isActive, requiredRoles('admin'), get.Swagger);

/**
 * @openapi
 * /docs/json:
 *   get:
 *     tags:
 *       - Docs Controller
 *     summary: Retrieve raw API documentation JSON
 *     description: Returns the OpenAPI specification in JSON format, which can be used to render API documentation or integrate with tools such as Swagger UI.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the API documentation JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI specification object.
 *               example:
 *                 openapi: "3.0.0"
 *                 info:
 *                   title: "Tempate API"
 *                   version: "1.0.0"
 *                 paths: {}
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
 *         description: Forbidden. The user is not authorized or account is inactive.
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
 *                   description: Error message indicating the user cannot update this tenant.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unknown error occurred.
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
router.get(ApiPath.Docs.Json, isAuthenticated, isActive, requiredRoles('admin'), get.Json);

/**
 * @openapi
 * /docs/yaml:
 *   get:
 *     tags:
 *       - Docs Controller
 *     summary: Retrieve raw API documentation in YAML format
 *     description: Returns the OpenAPI specification in YAML format, which can be used to render API documentation or integrate with tools such as Swagger UI.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the API documentation in YAML format.
 *         content:
 *           application/yaml:
 *             schema:
 *               type: string
 *               description: OpenAPI specification in YAML format.
 *               example: |
 *                 openapi: "3.0.0"
 *                 info:
 *                   title: "Template API"
 *                   version: "1.0.0"
 *                 paths: {}
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
 *         description: Forbidden. The user is not authorized or account is inactive.
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
 *                   description: Error message indicating the user cannot update this tenant.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unknown error occurred.
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
router.get(ApiPath.Docs.Yaml, isAuthenticated, isActive, requiredRoles('admin'), get.Yaml);

/**
 * @openapi
 * /docs/socket:
 *   get:
 *     tags:
 *       - Docs Controller
 *     summary: Serve Socket API documentation page
 *     description: Returns the HTML page containing the interactive API documentation (Swagger UI) specifically for the Socket-related endpoints, generated from the server's OpenAPI specification.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully served the Socket API documentation page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: The complete HTML content of the Swagger UI documentation page.
 *               example: "<!DOCTYPE html><html><head><title>Socket API Docs</title></head><body>...</body></html>"
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
 *         description: Forbidden. The user is not authorized or account is inactive.
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
 *                   description: Error message indicating the user cannot update this tenant.
 *                   example: "user account is currently inactive. please contact support for assistance"
 *       500:
 *         description: Internal server error. An unknown error occurred.
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
router.get(ApiPath.Docs.Socket, isAuthenticated, isActive, requiredRoles('admin'), get.Socket);

export default router;
