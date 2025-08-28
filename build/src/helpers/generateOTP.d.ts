/**
 ** Generates a 6-digit OTP (One Time Password).
 * This function uses the `otpGenerator` library to generate a 6-digit numeric OTP.
 * The generated OTP will only contain digits and will not include any alphabets or special characters.
 *
 * @returns A 6-digit numeric OTP.
 */
declare const generateOTP: () => number;
export default generateOTP;
