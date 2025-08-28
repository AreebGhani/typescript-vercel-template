import env from '@/config';
import db from '@/mongodb';
import { getFileNameFromUrl, InternalServerError } from '@/utils';

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
export const seeder = async (): Promise<void> => {
  try {
    if (env.NODE_ENV === 'test') return;
    // eslint-disable-next-line no-console
    console.log(`\x1B[0;36m[Mongoose]\x1B[0m \x1b[32mDatabase Seeded!\x1B[0m\n`);
  } catch (err) {
    const { statusCode, name, message } = InternalServerError(err);
    // eslint-disable-next-line no-console
    console.log(
      `\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] Mongoose(${JSON.stringify(
        {
          status: statusCode,
          name,
          message,
        },
        null,
        2
      )})\n`
    );
  }
};

/**
 ** Retrieves a set of file names used in the database.
 * This function queries various collections in the database to gather URLs of media files,
 * images, documents, and other file references. It then extracts the file names from these URLs
 * and returns a set of unique file names.
 * @returns {Promise<Set<string>>} A promise that resolves to a set of unique file names used in the database.
 */
export const getUsedFiles = async (): Promise<Set<string>> => {
  const users = await db.User.find().select('image');
  const files = [
    ...users.flatMap(user => (user.image ? [getFileNameFromUrl(user.image)] : [])),
  ].filter(Boolean);
  const normalizedFiles = files.map(file =>
    file.startsWith(`${env.STORAGE_BUCKET_NAME}/`)
      ? file.replace(`${env.STORAGE_BUCKET_NAME}/`, '')
      : file
  );
  return new Set(normalizedFiles);
};
