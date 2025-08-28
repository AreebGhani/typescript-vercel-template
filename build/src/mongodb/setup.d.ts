/**
 ** Imports data into the database. This function performs the following tasks:
 * 1. Checks if the environment is not 'test'.
 * 2. Checks if any plans exist in the database. If not, it fetches Stripe products,
 *    groups them into plans and their concierge counterparts, prepares the data,
 *    and inserts it into the database.
 * 3. Adds a 'free plan' and a 'custom plan' to the list of plans to be inserted.
 * 4. Checks if any currencies exist in the database. If not, it fetches the latest
 *    exchange rates from the Exchange Rate API and inserts them into the database.
 * @returns {Promise<void>} A promise that resolves when the data import is complete.
 * @throws {Stripe.errors.StripeError} If there is an error with the Stripe API.
 * @throws {Error} If there is a general error inserting data into MongoDB.
 */
export declare const seeder: () => Promise<void>;
/**
 ** Retrieves a set of file names used in the database.
 * This function queries various collections in the database to gather URLs of media files,
 * images, documents, and other file references. It then extracts the file names from these URLs
 * and returns a set of unique file names.
 * @returns {Promise<Set<string>>} A promise that resolves to a set of unique file names used in the database.
 */
export declare const getUsedFiles: () => Promise<Set<string>>;
