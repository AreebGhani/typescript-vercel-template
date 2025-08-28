import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';

import env from '@/config';
import type { DB } from '@/mongodb';
import type { Role, Status } from '@/types';

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

const userSchema: DB.Schema<IUser> = new Schema<IUser>(
  {
    firstName: {
      type: String,
      minLength: [2, 'min 2 characters required'],
      maxLength: [255, 'max characters exceeded'],
      required: [true, 'first name is required'],
    },
    lastName: {
      type: String,
      minLength: [2, 'min 2 characters required'],
      maxLength: [255, 'max characters exceeded'],
      required: [true, 'last name is required'],
    },
    email: {
      type: String,
      minLength: [4, 'min 4 characters required'],
      maxLength: [255, 'max characters exceeded'],
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      minLength: [6, 'min 6 characters required'],
      maxLength: [1024, 'max characters required'],
      required: [true, 'password is required'],
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
      minLength: [8, 'min 8 characters required'],
      maxLength: [1024, 'max characters required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// hashing password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

/**
 ** Represents the User model in the MongoDB database.
 * This model is based on the `userSchema` and adheres to the `IUser` interface.
 * @constant {DB.Model<IUser>} UserModel - The Mongoose model for the User collection.
 */
const UserModel: DB.Model<IUser> = model<IUser>('User', userSchema);
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

const deleteAccountRequestSchema: DB.Schema<IDeleteAccountRequest> =
  new Schema<IDeleteAccountRequest>(
    {
      user: {
        type: Schema.Types.ObjectId,
        required: [true, 'user id is required'],
      },
      reason: {
        type: String,
        minLength: [2, 'min 2 characters required'],
        maxLength: [255, 'max characters exceeded'],
        required: [true, 'reason is required'],
      },
    },
    { timestamps: true, versionKey: false }
  );

/**
 ** Represents the DeleteAccountRequest model in the MongoDB database.
 * This model is based on the `deleteAccountRequestSchema` and adheres to the `IDeleteAccountRequest` interface.
 * @constant {DB.Model<IDeleteAccountRequest>} DeleteAccountRequest - The Mongoose model for the User collection.
 */
export const DeleteAccountRequest: DB.Model<IDeleteAccountRequest> = model<IDeleteAccountRequest>(
  'DeleteAccountRequest',
  deleteAccountRequestSchema
);
