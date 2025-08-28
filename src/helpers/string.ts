/**
 ** Capitalizes the first letter of each word in a given string.
 * @param str - The input string to be transformed.
 * @returns The transformed string with each word capitalized.
 */
export const capitalize = (str: string): string =>
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

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
export const formatAddress = (addr: Address): string => {
  const { address, city, state, country } = addr;
  const formattedAddress = capitalize(address.trim());
  const formattedCity = capitalize(city);
  const formattedState = capitalize(state);
  const formattedCountry = capitalize(country);
  // Check if the address already ends with a comma
  const separator = formattedAddress.endsWith(',') ? '' : ',';
  return `${formattedAddress}${separator} ${formattedCity}, ${formattedState}, ${formattedCountry}`;
};
