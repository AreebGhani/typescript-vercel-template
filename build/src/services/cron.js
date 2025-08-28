/* eslint-disable no-console */
import cron from 'node-cron';
import env from '../config/index.js';
import { InternalServerError, listAllFiles, deleteFile } from '../utils/index.js';
import db from '../mongodb/index.js';
const scheduledDeleteUnusedFilesTask = async (now) => {
    // Runs every week at midnight
    try {
        const today = new Date(); // Current date
        console.log(`\x1B[0;34m[CronJob]\x1B[0m [${today.toISOString()}] (Delete Unused Files)\n`);
        // 1. Delete Unused Files from the bucket
        const allBucketFiles = await listAllFiles();
        const usedFiles = await db.getUsedFiles();
        const unusedFiles = allBucketFiles.filter(file => !usedFiles.has(file));
        console.log(`All Bucket Files: ${allBucketFiles.length}\nUsed Files: ${usedFiles.size}\nFiles to Delete: ${unusedFiles.length}\n\n`);
        if (env.NODE_ENV === 'production') {
            await Promise.all(unusedFiles.map(async (file) => {
                await deleteFile(file);
            }));
        }
    }
    catch (err) {
        const { statusCode, name, message } = InternalServerError(err);
        console.log(`\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] CronJob.DeleteFiles(${JSON.stringify({
            status: statusCode,
            name,
            message,
        }, null, 2)})\n`);
    }
};
// Schedule the cron job to run every week mid-night
const deleteUnusedFilesCronJob = cron.schedule('0 0 * * 0', now => {
    scheduledDeleteUnusedFilesTask(now).catch(err => {
        const { statusCode, name, message } = InternalServerError(err);
        console.log(`\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] CronJob.DeleteFiles(${JSON.stringify({
            status: statusCode,
            name,
            message,
        }, null, 2)})\n`);
    });
});
/**
 ** Starts the cron jobs for booking, currency rates, and deleting unused files.
 * This function initializes and starts the following cron jobs:
 * - `deleteUnusedFilesCronJob`: Removes unused files weekly at midnight.
 * @returns {void} This function does not return any value.
 */
const start = () => {
    deleteUnusedFilesCronJob.start();
};
/**
 ** Stops all running cron jobs.
 * This function stops the following cron jobs:
 * - `deleteUnusedFilesCronJob`
 * @returns {void} This function does not return a value.
 */
const stop = () => {
    deleteUnusedFilesCronJob.stop();
};
export default { start, stop };
//# sourceMappingURL=cron.js.map