/**
 ** Generates HTML email template.
 * @param {string} to - The recipient's name.
 * @param {string} body - The main content of the email in html.
 * @param {script} script - Optional script to pass inside html.
 * @returns {string} The complete HTML string for the email.
 * @example
 * const emailHtml = EmailTemplate('John Doe', '<p>This is the body of the email.</p>');
 * console.log(emailHtml);
 */
declare const EmailTemplate: (to: string, body: string, script?: string) => string;
export default EmailTemplate;
