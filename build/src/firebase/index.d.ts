import admin from 'firebase-admin';
/**
 * Initializes and returns a Firebase Admin app instance.
 * If an app instance already exists, it returns the existing instance.
 * Otherwise, it initializes a new app using the credentials from
 * `src/firebase/credential.json`.
 * If initialization fails, logs the error and exits the process.
 * @returns {admin.app.App} The Firebase Admin app instance.
 */
declare const firebase: () => admin.app.App;
/**
 ** Retrieves all users from Firebase Authentication.
 * This function fetches all user records from Firebase Authentication by
 * recursively calling the `listUsers` method until all users are retrieved.
 * @returns {Promise<admin.auth.UserRecord[]>} A promise that resolves to an array of user records.
 */
declare const getUsers: () => Promise<admin.auth.UserRecord[]>;
/**
 ** Checks if a phone number is verified in Firebase Authentication.
 * @param phoneNumber - The phone number to check.
 * @returns A promise that resolves to `true` if the phone number is verified, otherwise `false`.
 * @throws Will return `false` if there is an error retrieving the user record.
 */
declare const isPhoneNumberVerified: (phoneNumber: string) => Promise<boolean>;
export default firebase;
export { getUsers, isPhoneNumberVerified };
