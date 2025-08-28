import path from 'path';
import admin from 'firebase-admin';
import { StatusCode } from '../constants/index.js';
/**
 * Initializes and returns a Firebase Admin app instance.
 * If an app instance already exists, it returns the existing instance.
 * Otherwise, it initializes a new app using the credentials from
 * `src/firebase/credential.json`.
 * If initialization fails, logs the error and exits the process.
 * @returns {admin.app.App} The Firebase Admin app instance.
 */
const firebase = () => {
    try {
        return admin.apps.length && admin.app() !== undefined
            ? admin.app()
            : admin.initializeApp({
                credential: admin.credential.cert(path.join(path.resolve(), '/src/firebase/credential.json')),
            });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log(`\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] Firebase(${JSON.stringify({
            status: StatusCode.INTERNAL_SERVER_ERROR,
            name: 'Firebase Error',
            message: err instanceof Error ? err.message : 'an unknown error occurred',
        }, null, 2)})\n`);
        throw err;
    }
};
/**
 ** Retrieves all users from Firebase Authentication.
 * This function fetches all user records from Firebase Authentication by
 * recursively calling the `listUsers` method until all users are retrieved.
 * @returns {Promise<admin.auth.UserRecord[]>} A promise that resolves to an array of user records.
 */
const getUsers = async () => {
    const allUsers = [];
    const listAllUsers = async (nextPageToken) => {
        const res = await firebase().auth().listUsers(1000, nextPageToken);
        allUsers.push(...res.users);
        if (res.pageToken) {
            await listAllUsers(res.pageToken);
        }
    };
    await listAllUsers();
    return allUsers;
};
/**
 ** Checks if a phone number is verified in Firebase Authentication.
 * @param phoneNumber - The phone number to check.
 * @returns A promise that resolves to `true` if the phone number is verified, otherwise `false`.
 * @throws Will return `false` if there is an error retrieving the user record.
 */
const isPhoneNumberVerified = async (phoneNumber) => {
    try {
        const userRecord = await firebase().auth().getUserByPhoneNumber(phoneNumber);
        return userRecord.phoneNumber === phoneNumber && userRecord.phoneNumber !== null;
    }
    catch (err) {
        return false;
    }
};
export default firebase;
export { getUsers, isPhoneNumberVerified };
//# sourceMappingURL=index.js.map