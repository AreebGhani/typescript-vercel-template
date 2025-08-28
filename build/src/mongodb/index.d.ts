/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose from 'mongoose';
import * as Models from './models/index.js';
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
declare const db: {
    Otp: mongoose.Model<Models.IOtp, {}, {}, {}, mongoose.Document<unknown, {}, Models.IOtp> & Models.IOtp & Required<{
        _id: unknown;
    }> & {
        __v?: number | undefined;
    }, any>;
    User: mongoose.Model<Models.IUser, {}, {}, {}, mongoose.Document<unknown, {}, Models.IUser> & Models.IUser & Required<{
        _id: unknown;
    }> & {
        __v?: number | undefined;
    }, any>;
    DeleteAccountRequest: mongoose.Model<Models.IDeleteAccountRequest, {}, {}, {}, mongoose.Document<unknown, {}, Models.IDeleteAccountRequest> & Models.IDeleteAccountRequest & Required<{
        _id: unknown;
    }> & {
        __v?: number | undefined;
    }, any>;
    connect: () => void;
    disconnect: () => void;
    startSession: typeof mongoose.startSession;
    getUsedFiles: () => Promise<Set<string>>;
    MongooseError: typeof mongoose.Error;
    Schema: typeof mongoose.Schema;
    model: typeof mongoose.model;
};
export default db;
export type * as Types from './models/index.js';
export type * as DB from 'mongoose';
