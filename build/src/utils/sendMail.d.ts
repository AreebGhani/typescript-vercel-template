import { type SendMailOptions } from 'nodemailer';
/**
 ** Interface representing the options for sending an email.
 * @property {string} firstName - The first name of the recipient.
 * @property {string} email - The email address of the recipient.
 * @property {string} subject - The subject of the email.
 * @property {string} htmlBody - The HTML content of the email body.
 * @property {string} htmlScript - The optional HTML Script tag.
 */
export interface MailOptions {
    firstName: string;
    email: string;
    subject: string;
    htmlBody: string;
    htmlScript?: string;
    attachments?: SendMailOptions['attachments'];
}
/**
 ** Sends an email using the provided options.
 * @param {MailOptions} options - The options for sending the email.
 *   - `email` - The recipient's email address.
 *   - `subject` - The subject of the email.
 *   - `firstName` - The first name of the recipient.
 *   - `htmlBody` - The HTML body of the email.
 *   - `htmlScript` - The optional HTML Script tag.
 *   - `attachments` - The optional file attachments.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 * @throws {ErrorHandler} Throws an error if there is an issue sending the email.
 */
declare const sendMail: (options: MailOptions) => Promise<void>;
export default sendMail;
/**
 * List of common error codes that can occur when sending emails via SMTP.
 * @remarks
 * These error codes are typically returned by email transport libraries such as Nodemailer.
 * @property 'EAUTH' - Authentication failed
 * @property 'ECONNECTION' - Cannot connect to SMTP server
 * @property 'ETLS' - TLS negotiation failed
 * @property 'ESOCKET' - General socket error
 * @property 'ECONFIG' - Misconfiguration
 * @property 'EENVELOPE' - Invalid message envelope
 * @property 'EMESSAGE' - Invalid message
 * @property 'EPROTOCOL' - Protocol violation
 * @property 'ECOMPOSE' - Message composition failed
 * @property 'EADDRESS' - Invalid email address
 * @property 'ETIMEOUT' - Connection timed out
 * @property 'ESOCKETTIMEDOUT' - Socket timed out
 */
export declare const MailErrorCodes: string[];
