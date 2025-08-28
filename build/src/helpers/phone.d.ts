/**
 ** Formats a phone number to the international format using libphonenumber.
 * @param phoneNumber - The phone number to format.
 * @returns The formatted phone number in international format. If the phone number is invalid, returns the original phone number.
 */
declare const formatPhoneNumber: (phoneNumber: string) => string;
export default formatPhoneNumber;
