import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import env from '../../config/index.js';
const userSchema = new Schema({
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
}, { timestamps: true, versionKey: false });
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
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
/**
 ** Represents the User model in the MongoDB database.
 * This model is based on the `userSchema` and adheres to the `IUser` interface.
 * @constant {DB.Model<IUser>} UserModel - The Mongoose model for the User collection.
 */
const UserModel = model('User', userSchema);
export default UserModel;
const deleteAccountRequestSchema = new Schema({
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
}, { timestamps: true, versionKey: false });
/**
 ** Represents the DeleteAccountRequest model in the MongoDB database.
 * This model is based on the `deleteAccountRequestSchema` and adheres to the `IDeleteAccountRequest` interface.
 * @constant {DB.Model<IDeleteAccountRequest>} DeleteAccountRequest - The Mongoose model for the User collection.
 */
export const DeleteAccountRequest = model('DeleteAccountRequest', deleteAccountRequestSchema);
//# sourceMappingURL=user.js.map