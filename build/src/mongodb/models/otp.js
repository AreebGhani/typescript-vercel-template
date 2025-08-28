import { Schema, model } from 'mongoose';
const otpSchema = new Schema({
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
}, { timestamps: true, versionKey: false });
/**
 ** Represents the Otp model in the MongoDB database.
 * This model is based on the `otpSchema` and adheres to the `IOtp` interface.
 * @constant {DB.Model<IOtp>} OtpModel - The Mongoose model for the Otp collection.
 */
const OtpModel = model('Otp', otpSchema);
export default OtpModel;
//# sourceMappingURL=otp.js.map