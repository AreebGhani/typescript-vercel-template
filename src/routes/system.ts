import express from 'express';

import { ApiPath } from '@/constants';
import { isAuthenticated, isActive, requiredRoles } from '@/middlewares';
import { SystemController } from '@/controllers';

const router = express.Router();
const { get } = SystemController;

/**
 * @openapi
 * /system/info:
 *   get:
 *     tags:
 *       - System Controller
 *     summary: Get system information
 *     description: Retrieves detailed system information including CPU, memory, disk, network, and process statistics from the server.
 *     responses:
 *       200:
 *         description: Successfully retrieved system information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 info:
 *                   type: object
 *                   properties:
 *                     os:
 *                       type: object
 *                       description: Operating system details.
 *                       properties:
 *                         platform:
 *                           type: string
 *                           example: "linux"
 *                         distro:
 *                           type: string
 *                           example: "Ubuntu 22.04.3 LTS"
 *                         release:
 *                           type: string
 *                           example: "22.04"
 *                         arch:
 *                           type: string
 *                           example: "x64"
 *                     cpu:
 *                       type: object
 *                       description: CPU details and load.
 *                       properties:
 *                         manufacturer:
 *                           type: string
 *                           example: "Intel®"
 *                         brand:
 *                           type: string
 *                           example: "Core™ i7-9700K"
 *                         speed:
 *                           type: string
 *                           example: "3.60"
 *                         cores:
 *                           type: integer
 *                           example: 8
 *                         physicalCores:
 *                           type: integer
 *                           example: 8
 *                         usagePercent:
 *                           type: number
 *                           example: 12.5
 *                         perCoreLoad:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [10.2, 12.4, 13.1, 9.8]
 *                     memory:
 *                       type: object
 *                       description: Memory statistics.
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 17179869184
 *                         free:
 *                           type: integer
 *                           example: 4294967296
 *                         used:
 *                           type: integer
 *                           example: 12884901888
 *                         active:
 *                           type: integer
 *                           example: 10737418240
 *                         available:
 *                           type: integer
 *                           example: 6442450944
 *                         usagePercent:
 *                           type: number
 *                           example: 75.0
 *                     disk:
 *                       type: object
 *                       description: Disk layout and usage.
 *                       properties:
 *                         layout:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               device:
 *                                 type: string
 *                                 example: "/dev/sda"
 *                               type:
 *                                 type: string
 *                                 example: "SSD"
 *                               name:
 *                                 type: string
 *                                 example: "Samsung SSD 970 EVO"
 *                               size:
 *                                 type: integer
 *                                 example: 512110190592
 *                         io:
 *                           type: object
 *                           properties:
 *                             rIO:
 *                               type: integer
 *                               example: 123456
 *                             wIO:
 *                               type: integer
 *                               example: 654321
 *                         fileSystems:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               fs:
 *                                 type: string
 *                                 example: "/dev/sda1"
 *                               type:
 *                                 type: string
 *                                 example: "ext4"
 *                               size:
 *                                 type: integer
 *                                 example: 512110190592
 *                               used:
 *                                 type: integer
 *                                 example: 256055095296
 *                               available:
 *                                 type: integer
 *                                 example: 256055095296
 *                               usagePercent:
 *                                 type: number
 *                                 example: 50.0
 *                               mount:
 *                                 type: string
 *                                 example: "/"
 *                     network:
 *                       type: object
 *                       properties:
 *                         interfaces:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               iface:
 *                                 type: string
 *                                 example: "eth0"
 *                               ip4:
 *                                 type: string
 *                                 example: "192.168.1.100"
 *                               mac:
 *                                 type: string
 *                                 example: "00:1A:2B:3C:4D:5E"
 *                               speed:
 *                                 type: integer
 *                                 example: 1000
 *                         stats:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               iface:
 *                                 type: string
 *                                 example: "eth0"
 *                               rx_bytes:
 *                                 type: integer
 *                                 example: 12345678
 *                               tx_bytes:
 *                                 type: integer
 *                                 example: 87654321
 *                               rx_dropped:
 *                                 type: integer
 *                                 example: 0
 *                               tx_dropped:
 *                                 type: integer
 *                                 example: 0
 *                     processes:
 *                       type: object
 *                       properties:
 *                         all:
 *                           type: integer
 *                           example: 250
 *                         running:
 *                           type: integer
 *                           example: 120
 *                         blocked:
 *                           type: integer
 *                           example: 2
 *                         sleeping:
 *                           type: integer
 *                           example: 128
 *                         list:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               pid:
 *                                 type: integer
 *                                 example: 1234
 *                               name:
 *                                 type: string
 *                                 example: "node"
 *                               cpu:
 *                                 type: number
 *                                 example: 2.5
 *                               mem:
 *                                 type: number
 *                                 example: 1.2
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
router.get(ApiPath.System.Info, isAuthenticated, isActive, requiredRoles('admin'), get.Info);

export default router;
