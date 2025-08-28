import type { DB } from '../../mongodb/index.js';
import type { Role, Status } from '../../types/index.js';
/**
 ** Interface representing a user.
 * @interface IUser
 * @extends {DB.Document}
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} phone - The phone number of the user.
 * @property {string} image - The URL of the user's profile image.
 * @property {Role} role - The role of the user in the system.
 * @property {Status} status - The status of the user account.
 * @property {boolean} isDeleted - Indicates if the user account is deleted.
 * @property {Date} createdAt - The date when the user was created.
 * @property {Date} updatedAt - The date when the user was last updated.
 * @property {() => string} getJwtToken - Method to generate a JWT token for the user.
 * @property {(enteredPassword: string) => Promise<boolean>} comparePassword - Method to compare the entered password with the stored hashed password.
 */
export interface IUser extends DB.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    image?: string;
    role: Role;
    status: Status;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    getJwtToken: () => string;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
}
/**
 ** Represents the User model in the MongoDB database.
 * This model is based on the `userSchema` and adheres to the `IUser` interface.
 * @constant {DB.Model<IUser>} UserModel - The Mongoose model for the User collection.
 */
declare const UserModel: DB.Model<IUser>;
export default UserModel;
/**
 ** Interface representing a delete account user request.
 * @interface IDeleteAccountRequest
 * @extends {DB.Document}
 * @property {IUser} user - The user associated with the delete account request.
 * @property {string} reason - The reason of deleting account.
 * @property {Date} createdAt - The date when the request was created.
 * @property {Date} updatedAt - The date when the request was last updated.
 */
export interface IDeleteAccountRequest extends DB.Document {
    user: IUser;
    reason: string;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 ** Represents the DeleteAccountRequest model in the MongoDB database.
 * This model is based on the `deleteAccountRequestSchema` and adheres to the `IDeleteAccountRequest` interface.
 * @constant {DB.Model<IDeleteAccountRequest>} DeleteAccountRequest - The Mongoose model for the User collection.
 */
export declare const DeleteAccountRequest: DB.Model<IDeleteAccountRequest>;
