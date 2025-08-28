import os from 'os';
import express from 'express';
import kill from 'kill-port';
import chalk from 'chalk';
import env from '../config/index.js';
import { errorMiddleware } from '../middlewares/index.js';
import { setupHttpServer, setupSocketIO, cronJobs } from '../services/index.js';
/**
 ** Checks if a given port is in use and attempts to free it by terminating the process using it.
 * @param port - The port number to check and free.
 * @returns The port number that was checked.
 * @example
 * const port = 3000;
 * console.log(freePort(port));
 */
const freePort = async (port) => {
    await kill(port).catch(error => {
        if (!error?.message?.includes('No process running on port')) {
            console.log(`⚠️ Failed to free port ${port}: ${error?.message}\n`);
        }
    });
    return port;
};
/**
 ** Starts the server and sets up the necessary configurations.
 * @returns An object containing the HTTP server and the Socket.IO server.
 * @property {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} http - The HTTP server instance.
 * @property {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io - The Socket.IO server instance.
 * @remarks
 * - Sets up the Express application and HTTP server.
 * - Configures and starts the Socket.IO server.
 * - Logs system information and server details upon successful startup.
 * - Handles uncaught exceptions and unhandled promise rejections by shutting down the server gracefully.
 * - Uses custom error handling middleware.
 */
const startServer = async () => {
    const app = express();
    const PORT = await freePort(Number(env.PORT));
    // Setup the http server
    const server = setupHttpServer(app);
    // Setup Socket.io
    const io = setupSocketIO(server);
    // Start the server
    server.listen(PORT, () => {
        // Get the network and local IPs
        const networkInterfaces = os.networkInterfaces();
        const ips = Object.values(networkInterfaces)
            .flat()
            .filter(details => details && details.family === 'IPv4' && !details.internal)
            .map(details => details?.address);
        const localIp = `http://localhost:${PORT}`;
        // Log the environment and server details
        console.log(`\n🌐 Server is listening On ~>`);
        console.log(`   Local:   ${chalk.green(localIp)}`);
        const formattedIps = ips.length > 0
            ? ips.map(ip => chalk.cyan(`http://${ip}:${PORT}`)).join(', ')
            : 'IP not available';
        console.log(`   Network: ${formattedIps}`);
        console.log(`   Live: ${chalk.magenta('https://typescript-vercel-template.vercel.app')}`);
        console.log(`   Environment: ${chalk.yellow(env.NODE_ENV)}\n\n`);
        cronJobs.start(); // Start CRON Jobs
    });
    // Handling uncaught Exception
    process.on('uncaughtException', (err) => {
        console.error(`Error: ${err.message}`);
        console.error(`🚨 shutting down the server for handling uncaught exception`);
        cronJobs.stop(); // Stop CRON Jobs
        void io.close(); // Close Socket.IO
        server.close(() => {
            process.exit(1);
        });
    });
    // unhandled promise rejection
    process.on('unhandledRejection', (err) => {
        console.error(`Error: ${err.message}`);
        console.error(`🚨 shutting down the server for unhandle promise rejection`);
        cronJobs.stop(); // Stop CRON Jobs
        void io.close(); // Close Socket.IO
        server.close(() => {
            process.exit(1);
        });
    });
    // Use custom error handling middleware
    app.use(errorMiddleware);
    return { http: server, io };
};
export default startServer;
//# sourceMappingURL=index.js.map