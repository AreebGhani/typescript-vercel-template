/**
 ** Checks if the provided string is a valid JSON.
 * @param data - The string to be validated as JSON.
 * @returns `true` if the string is a valid JSON, otherwise `false`.
 */
export declare const isValidJSON: (data: string) => boolean;
/**
 ** Regular expression to validate that a string contains only alphabetic characters (both uppercase and lowercase).
 * @example
 * // Valid names
 * const isValid = nameRegex.test("John"); // true
 * const isValid = nameRegex.test("Alice"); // true
 * // Invalid names
 * const isValid = nameRegex.test("John123"); // false
 * const isValid = nameRegex.test("Alice!"); // false
 */
export declare const nameRegex: RegExp;
/**
 ** Regular expression to validate that a string is a full name consisting of two words,
 * each with at least two alphabetic characters (uppercase or lowercase), separated by a space.
 * @example
 * // Valid full names
 * const isValid = FullNameRegex.test("John Doe"); // true
 * const isValid = FullNameRegex.test("Alice Smith"); // true
 * // Invalid full names
 * const isValid = FullNameRegex.test("J Doe"); // false
 * const isValid = FullNameRegex.test("John"); // false
 * const isValid = FullNameRegex.test("John123 Doe"); // false
 * const isValid = FullNameRegex.test("John Doe!"); // false
 */
export declare const FullNameRegex: RegExp;
/**
 ** Represents the result of a validation operation.
 * @property {boolean} error - Indicates whether the validation failed.
 * @property {string} message - Provides a message describing the validation failure result.
 */
export interface ValidationResult {
    error: boolean;
    message: string;
}
/**
 ** Interface representing the parameters for credential validation.
 * @property {string} email - The email address to be validated.
 * @property {string} phone - The phone number to be validated.
 * @property {string} firstName - The first name to be validated.
 * @property {string} lastName - The last name to be validated.
 * @property {string} password - The password to be validated.
 * @property {boolean} isLogin - Indicates if the validation is for a login process.
 */
export interface CredentialValidatorParams {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isLogin?: boolean;
}
/**
 ** Validates user credentials including email, phone, first name, last name, and password.
 * @param {CredentialValidatorParams} params - The parameters for credential validation object:
 *   - `email` - The email address to validate.
 *   - `phone` - The phone number to validate.
 *   - `firstName` - The first name to validate.
 *   - `lastName` - The last name to validate.
 *   - `password` - The password to validate.
 *   - `isLogin` - Indicates if the validation is for login purposes.
 * @returns {ValidationResult} The result of the validation.
 * @example
 * const result = credentialValidator({
 *   email: 'example@example.com',
 *   phone: '+1234567890',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   password: 'password123',
 *   isLogin: true
 * });
 * if (result.error) {
 *   console.error(result.message);
 * } else {
 *   console.log('Validation passed');
 * }
 */
export declare const credentialValidator: ({ email, phone, firstName, lastName, password, isLogin, }: CredentialValidatorParams) => ValidationResult;
