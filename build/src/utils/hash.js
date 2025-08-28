import jwt from 'jsonwebtoken';
import crypto from 'crypto-js';
import bcrypt from 'bcrypt';
import env from '../config/index.js';
// Generate SHA256 hash
export const hashAlgorithm = (s) => crypto.SHA256(s).toString(crypto.enc.Hex);
export const encrypt = (state) => {
    const stateString = JSON.stringify(state);
    // Hash the state
    const hash = hashAlgorithm(stateString);
    // Generate a JWT token
    const token = jwt.sign(state, env.JWT_SECRET_KEY);
    // Hash the SHA256 output using bcrypt to add complexity
    const salt = bcrypt.genSaltSync(10);
    const bcryptHash = bcrypt.hashSync(hash, salt);
    // Return combined bcrypt hash and JWT token
    return `${bcryptHash}${token}`;
};
export const decrypt = async (cryptoString) => {
    // Extract bcrypt hash and token
    const bcryptHash = cryptoString.slice(0, 60); // Bcrypt hashes are 60 chars long
    const token = cryptoString.slice(60); // Rest is the JWT token
    // Verify the JWT token
    const state = jwt.verify(token, env.JWT_SECRET_KEY);
    delete state.exp;
    delete state.iat;
    // Recreate the original hash from the decrypted state
    const stateString = JSON.stringify(state);
    const originalHash = hashAlgorithm(stateString);
    // Compare the original hash with the stored bcrypt hash
    const isValid = await bcrypt.compare(originalHash, bcryptHash);
    if (isValid) {
        return state;
    }
    else {
        throw new Error('decryption failed');
    }
};
//# sourceMappingURL=hash.js.map