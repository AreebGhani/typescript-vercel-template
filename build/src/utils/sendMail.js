import nodemailer from 'nodemailer';
import env from '../config/index.js';
import { EmailTemplate } from '../templates/index.js';
import { InternalServerError } from './ErrorHandler.js';
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
const sendMail = async (options) => {
    // Create a transporter object using SMTP configuration
    const transporter = nodemailer.createTransport({
        auth: {
            user: env.SMTP_EMAIL,
            pass: env.SMTP_PASSWORD,
        },
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
    });
    const mailOptions = {
        from: env.SMTP_EMAIL,
        to: options.email,
        subject: options.subject,
        html: EmailTemplate(options.firstName, options.htmlBody, options.htmlScript),
        attachments: options.attachments || [],
    };
    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
        if (env.NODE_ENV !== 'production') {
            const timestamp = new Date().toISOString(); // Add a timestamp to the log
            const formatInfo = (info) => typeof info === 'object' ? JSON.stringify(info, null, 2) : String(info);
            // eslint-disable-next-line no-console
            console.log(`\x1B[0;32m[Nodemailer]\x1B[0m [${timestamp}] ${formatInfo({ from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject, info })}\n`);
        }
        if (err !== undefined && err !== null) {
            const ServerError = InternalServerError(err);
            // eslint-disable-next-line no-console
            console.log(`\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] Nodemailer(${JSON.stringify({
                status: ServerError.statusCode,
                name: ServerError.name,
                message: ServerError.message,
            }, null, 2)})\n`);
        }
    });
};
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
export const MailErrorCodes = [
    'EAUTH',
    'ECONNECTION',
    'ETLS',
    'ESOCKET',
    'ECONFIG',
    'EENVELOPE',
    'EMESSAGE',
    'EPROTOCOL',
    'ECOMPOSE',
    'EADDRESS',
    'ETIMEOUT',
    'ESOCKETTIMEDOUT',
];
//# sourceMappingURL=sendMail.js.map