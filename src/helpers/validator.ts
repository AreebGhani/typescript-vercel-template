import validator from 'validator';
import libphonenumber, { type PhoneNumber } from 'google-libphonenumber';

import { InternalServerError } from '@/utils';

/**
 ** Checks if the provided string is a valid JSON.
 * @param data - The string to be validated as JSON.
 * @returns `true` if the string is a valid JSON, otherwise `false`.
 */
export const isValidJSON = (data: string): boolean => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

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
export const nameRegex = /^[a-zA-Z]+$/;

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
export const FullNameRegex = /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/;

/**
 ** An instance of the `PhoneNumberUtil` class from the `libphonenumber` library.
 * This utility is used for parsing, formatting, and validating international phone numbers.
 */
const phoneUtil: libphonenumber.PhoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

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
export const credentialValidator = ({
  email,
  phone,
  firstName,
  lastName,
  password,
  isLogin = false,
}: CredentialValidatorParams): ValidationResult => {
  try {
    // Validate email if provided
    if (email !== undefined && email !== null && email.trim() !== '') {
      const isValid: boolean = validator.isEmail(email);
      if (!isValid) {
        return { error: true, message: 'invalid email' };
      }
    }
    // Validate phone number if provided
    if (phone !== undefined && phone !== null && phone.trim() !== '') {
      const parsedPhone: PhoneNumber = phoneUtil.parseAndKeepRawInput(phone);
      const isValid: boolean = phoneUtil.isValidNumber(parsedPhone);
      if (!isValid) {
        return { error: true, message: 'invalid phone number' };
      }
    }
    // Ensure at least one contact method is provided for login
    if (
      isLogin &&
      ((email === undefined && email === null && phone === undefined && phone === null) ||
        (email === '' && phone === ''))
    ) {
      return { error: true, message: 'invalid email or phone number' };
    }
    // Validate first name if provided
    if (firstName !== undefined && firstName !== null) {
      const isValid: boolean = nameRegex.test(firstName);
      if (!isValid) {
        return { error: true, message: 'invalid first name' };
      }
    }
    // Validate last name if provided
    if (lastName !== undefined && lastName !== null) {
      const isValid: boolean = nameRegex.test(lastName);
      if (!isValid) {
        return { error: true, message: 'invalid last name' };
      }
    }
    // Validate password if provided
    if (password !== undefined && password !== null) {
      const isValid: boolean = validator.isLength(password, { min: 8 });
      if (!isValid) {
        return { error: true, message: 'password length should be greater than 8' };
      }
    }
    // Return no errors if all validations pass
    return { error: false, message: '' };
  } catch (err) {
    const { message } = InternalServerError(err);
    return { error: true, message };
  }
};
