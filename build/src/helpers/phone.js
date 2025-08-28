import libphonenumber from 'google-libphonenumber';
/**
 ** Formats a phone number to the international format using libphonenumber.
 * @param phoneNumber - The phone number to format.
 * @returns The formatted phone number in international format. If the phone number is invalid, returns the original phone number.
 */
const formatPhoneNumber = (phoneNumber) => {
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    try {
        const number = phoneUtil.parseAndKeepRawInput(phoneNumber);
        return phoneUtil.format(number, libphonenumber.PhoneNumberFormat.INTERNATIONAL);
    }
    catch (err) {
        return phoneNumber;
    }
};
export default formatPhoneNumber;
//# sourceMappingURL=phone.js.map