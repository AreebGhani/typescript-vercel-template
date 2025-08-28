import mongoose from 'mongoose';

import env from '@/config';
import { StatusCode } from '@/constants';
import { seeder, getUsedFiles } from './setup';
import * as Models from './models';

/**
 ** Interface representing the options for a MongoDB connection.
 * Extends the mongoose.ConnectOptions interface to include additional options.
 * @property {boolean} useNewUrlParser - Determines whether to use the new URL parser.
 * @property {boolean} useUnifiedTopology - Determines whether to use the new unified topology engine.
 */
interface ConnectionOptions extends mongoose.ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

/**
 ** Establishes a connection to the MongoDB database using Mongoose.
 * This function configures Mongoose to log database operations in non-production environments,
 * excluding operations on the 'transactions' collection. It also attempts to connect to the
 * database using the provided connection options and logs the connection status.
 * @remarks
 * - In non-production environments, database operations are logged with a timestamp.
 * - If the connection is successful, it imports initial data into the database.
 * - If the connection fails, an error message is logged.
 * @throws Will log an error message if the connection to MongoDB fails.
 */
const connect = (): void => {
  const options: ConnectionOptions = {
    replicaSet: 'rs1',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
    if (env.NODE_ENV !== 'production') {
      if (collectionName.toLowerCase() !== 'transactions') {
        const formatArgs = (args: any[]): string =>
          args
            .map(arg => {
              if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2); // Format objects as JSON
              }
              return String(arg); // Convert other types to strings
            })
            .join(', ');
        const timestamp = new Date().toISOString(); // Add a timestamp to the log
        // eslint-disable-next-line no-console
        console.log(
          `\x1B[0;36m[Mongoose]\x1B[0m [${timestamp}] ${collectionName}.${methodName}(${formatArgs(methodArgs)})\n`
        );
      }
    }
  });
  // connect to MongoDB
  mongoose
    .connect(env.DATABASE_URL, env.NODE_ENV === 'production' ? options : undefined)
    .then(async data => {
      const { host, port, name: dbName, user } = data.connection;
      const safeUri = `mongodb://${user ? `${user}@` : ''}${host}:${port}/${dbName}`;
      // eslint-disable-next-line no-console
      console.log(`\x1B[0;36m[Mongoose]\x1B[0m \x1b[32mConnected → ${safeUri}\x1B[0m\n`);
      await seeder();
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(
        `\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] Mongoose(${JSON.stringify(
          {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            name: 'Mongoose Error',
            message: err instanceof Error ? err.message : 'an unknown error occurred',
          },
          null,
          2
        )})\n`
      );
    });
};

/**
 ** Disconnects from the MongoDB database using Mongoose.
 * Closes the current Mongoose connection and logs the result to the console.
 * If the disconnection is successful, a timestamped message is logged.
 * If an error occurs during disconnection, a detailed error message is logged.
 * @returns {void}
 */
const disconnect = (): void => {
  mongoose.connection
    .close()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(
        `\x1B[0;36m[Mongoose]\x1B[0m [${new Date().toISOString()}] \x1b[31mDisconnected from MongoDB\x1B[0m\n`
      );
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(
        `\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] Mongoose(${JSON.stringify(
          {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            name: 'Mongoose Error',
            message: err instanceof Error ? err.message : 'an unknown error occurred',
          },
          null,
          2
        )})\n`
      );
    });
};

/**
 ** Creates a new MongoDB client session using Mongoose.
 * Sessions are used to support transactions and other advanced features in MongoDB.
 * @see {@link https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-startSession}
 * @returns {Promise<mongoose.ClientSession>} A promise that resolves to a new client session.
 */
const startSession = mongoose.startSession;

/**
 ** Represents the base error class for all Mongoose-related errors.
 * Provides access to error types thrown by Mongoose operations, such as validation errors,
 * cast errors, and connection errors.
 * @see {@link https://mongoosejs.com/docs/api/error.html|Mongoose Error Documentation}
 */
const MongooseError = mongoose.Error;

/**
 * Represents the main MongoDB database interface, providing methods for connection management,
 * session handling, file usage tracking, error handling, schema/model creation, and access to all defined models.
 * @property {Function} connect - Establishes a connection to the MongoDB database.
 * @property {Function} disconnect - Closes the connection to the MongoDB database.
 * @property {Function} startSession - Starts a new MongoDB session for transaction support.
 * @property {Function} getUsedFiles - Retrieves files that have been used or processed.
 * @property {typeof MongooseError} MongooseError - Reference to the Mongoose error class for error handling.
 * @property {typeof mongoose.Schema} Schema - Reference to the Mongoose Schema constructor for defining schemas.
 * @property {typeof mongoose.model} model - Reference to the Mongoose model function for creating models.
 * @property {Record<string, mongoose.Model<any>>} Models - All defined Mongoose models, spread into the db object.
 */
const db = {
  connect,
  disconnect,
  startSession,
  getUsedFiles,
  MongooseError,
  Schema: mongoose.Schema,
  model: mongoose.model,
  ...Models,
};

export default db;
export type * as Types from './models';
export type * as DB from 'mongoose';
