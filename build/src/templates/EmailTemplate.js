import env from '../config/index.js';
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
const EmailTemplate = (to, body, script) => {
    const date = new Date();
    const year = date.getFullYear();
    return `
  ${script ?? ''}
  <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${env.APP_NAME}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
      rel="stylesheet" />
    <style media="all" type="text/css">
      @media all {
        .btn-primary table td:hover {
          background-color: #005451 !important;
          color: #ffffff;
        }
        .btn-primary a:hover {
          background-color: #005451 !important;
          border-color: #005451 !important;
          color: #ffffff;
        }
      }
      @media only screen and (max-width: 640px) {
        .main p,
        .main td,
        .main span {
          font-size: 16px !important;
        }
        .wrapper {
          padding: 8px !important;
        }
        .content {
          padding: 0 !important;
        }
        .container {
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100% !important;
        }
        .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        .btn table {
          max-width: 100% !important;
          width: 100% !important;
        }
        .btn a {
          font-size: 16px !important;
          max-width: 100% !important;
          width: 100% !important;
        }
      }
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .ii a[href] {
          color: #ffffff !important;
        }
        .im {
          color: #ffffff !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: Inter, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.3;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      background-color: #f4f5f6;
      margin: 0;
      padding: 0;
    ">
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="body"
      style="
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        background-color: #f4f5f6;
        width: 100%;
      "
      width="100%"
      bgcolor="#f4f5f6">
      <tr>
        <td
          style="font-family: Inter, sans-serif; font-size: 16px; vertical-align: top"
          valign="top">
          &nbsp;
        </td>
        <td
          class="container"
          style="
            font-family: Inter, sans-serif;
            font-size: 16px;
            vertical-align: top;
            max-width: 600px;
            padding: 0;
            padding-top: 24px;
            width: 1380px;
            margin: 0 auto;
          "
          width="1380"
          valign="top">
          <div
            class="content"
            style="
              box-sizing: border-box;
              display: block;
              margin: 0 auto;
              max-width: 600px;
              padding: 0;
            ">
            <!-- START CENTERED WHITE CONTAINER -->
            <span
              class="preheader"
              style="
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0;
              "
              >Welcome to ${env.APP_NAME}</span
            >
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="main"
              style="
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                background: #005451;
                color: #ffffff;
                border: 1px solid #eaebed;
                border-radius: 16px;
                width: 100%;
              "
              width="100%">
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td
                  class="wrapper"
                  style="
                    font-family: Inter, sans-serif;
                    font-size: 16px;
                    vertical-align: top;
                    box-sizing: border-box;
                    padding: 24px;
                  "
                  valign="top">
                  <div style="text-align: center;">
                    <img
                      src="https://lh3.googleusercontent.com/d/1Cst05fykAfdHxrHb4JINe-WO4g9lH36V"
                      alt=${env.APP_NAME}
                      style="width: 50px; height: 50px" />
                  </div>
                  <br /><br />
                  <p
                    style="
                      font-family: Inter, sans-serif;
                      font-size: 16px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 16px;
                      color: #ffffff;
                      text-transform: capitalize;
                    ">
                    Hi ${to},
                  </p>
                  <p
                    style="
                      font-family: Inter, sans-serif;
                      font-size: 16px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 16px;
                    ">
                    ${body}
                    <br /><br />
                    Thank you for choosing ${env.APP_NAME}.
                  </p>
                </td>
              </tr>
              <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- START FOOTER -->
            <div
              class="footer"
              style="clear: both; padding-top: 24px; text-align: center; width: 100%">
              <table
                role="presentation"
                border="0"
                cellpadding="2"
                cellspacing="10"
                style="
                  border-collapse: separate;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  width: 100%;
                "
                width="100%">
                <tr>
                  <td
                    class="content-block powered-by"
                    style="
                      font-family: Inter, sans-serif;
                      vertical-align: top;
                      color: #9a9ea6;
                      font-size: 16px;
                      text-align: center;
                    "
                    valign="top"
                    align="center">
                    Best regards,
                    <a
                      href="mailto:${env.SMTP_EMAIL}?subject=Request%20for%20Assistance%20or%20Guidance&body=Dear%20Team,%0A%0AI%20hope%20this%20message%20finds%20you%20well.%0A%0AI%20am%20reaching%20out%20for%20assistance%20or%20guidance%20regarding%20[mention%20the%20issue%20or%20topic].%20I%20would%20greatly%20appreciate%20any%20help%20or%20advice%20you%20can%20offer.%0A%0AThank%20you%20for%20your%20time%20and%20support.%20I%20look%20forward%20to%20your%20response.%0A%0ABest%20regards%2C%0A[Your%20Name]%0A[Your%20Contact%20Information]"
                      style="
                        color: #9a9ea6;
                        font-size: 16px;
                        text-align: center;
                        text-decoration: underline;
                      "
                      >${env.SMTP_EMAIL}</a
                    >
                  </td>
                </tr>
                <tr>
                  <td
                    class="content-block powered-by"
                    style="
                      font-family: Inter, sans-serif;
                      vertical-align: top;
                      color: #9a9ea6;
                      font-size: 16px;
                      text-align: center;
                    "
                    valign="top"
                    align="center">
                    &copy; ${year} –
                    <a
                      href="${env.FRONTEND_URL}"
                      target="_blank"
                      rel="noopener"
                      style="
                        color: #9a9ea6;
                        font-size: 16px;
                        text-align: center;
                        text-decoration: underline;
                      "
                    >${env.APP_NAME}</a
                    >. All rights reserved.
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->
            <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td
          style="font-family: Inter, sans-serif; font-size: 16px; vertical-align: top"
          valign="top">
          &nbsp;
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};
export default EmailTemplate;
//# sourceMappingURL=EmailTemplate.js.map