/**
 ** Capitalizes the first letter of each word in a given string.
 * @param str - The input string to be transformed.
 * @returns The transformed string with each word capitalized.
 */
export declare const capitalize: (str: string) => string;
/**
 ** Represents an address with detailed location information.
 * @interface Address
 * @property {string} address - The street address.
 * @property {string} city - The city of the address.
 * @property {string} state - The state or province of the address.
 * @property {string} country - The country of the address.
 */
interface Address {
    address: string;
    city: string;
    state: string;
    country: string;
}
/**
 ** Formats an address object into a single string with proper capitalization and punctuation.
 * @param {Address} addr - The address object containing the address, city, state, and country.
 * @returns {string} The combined formatted address string.
 */
export declare const formatAddress: (addr: Address) => string;
export {};
