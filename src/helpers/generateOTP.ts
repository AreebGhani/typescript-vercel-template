import otpGenerator from 'otp-generator';

/**
 ** Generates a 6-digit OTP (One Time Password).
 * This function uses the `otpGenerator` library to generate a 6-digit numeric OTP.
 * The generated OTP will only contain digits and will not include any alphabets or special characters.
 *
 * @returns A 6-digit numeric OTP.
 */
const generateOTP = (): number => {
  return Number(
    otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
  );
};

export default generateOTP;
