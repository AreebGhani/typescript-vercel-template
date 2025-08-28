import { Schema, model } from 'mongoose';

import type { DB } from '@/mongodb';

/**
 ** Interface representing an OTP (One-Time Password).
 * @interface IOtp
 * @extends {DB.Document}
 * @property {number} otp - The one-time password.
 * @property {string} email - The email associated with the OTP.
 * @property {string} phone - The phone number associated with the OTP.
 * @property {Date} expiryTime - The expiration time of the OTP.
 * @property {number} resendAttempts - The number of times the OTP has been resent.
 * @property {Date} lastOtpSent - The timestamp of the last OTP sent.
 * @property {Date} createdAt - The timestamp when the OTP was created.
 * @property {Date} updatedAt - The timestamp when the OTP was last updated.
 */
export interface IOtp extends DB.Document {
  otp: number;
  email: string;
  phone?: string;
  expiryTime: Date;
  resendAttempts: number;
  lastOtpSent: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const otpSchema: DB.Schema<IOtp> = new Schema<IOtp>(
  {
    otp: {
      type: Number,
      required: [true, 'otp is required'],
      unique: true,
    },
    email: {
      type: String,
      minLength: [4, 'min 4 characters required'],
      maxLength: [255, 'max characters exceeded'],
      required: [true, 'email is required'],
      unique: true,
    },
    phone: {
      type: String,
    },
    expiryTime: {
      type: Date,
      required: [true, 'expiry time is required'],
    },
    resendAttempts: {
      type: Number,
      default: 1,
    },
    lastOtpSent: {
      type: Date,
      required: [true, 'last otp sent time is required'],
    },
  },
  { timestamps: true, versionKey: false }
);

/**
 ** Represents the Otp model in the MongoDB database.
 * This model is based on the `otpSchema` and adheres to the `IOtp` interface.
 * @constant {DB.Model<IOtp>} OtpModel - The Mongoose model for the Otp collection.
 */
const OtpModel: DB.Model<IOtp> = model<IOtp>('Otp', otpSchema);
export default OtpModel;
