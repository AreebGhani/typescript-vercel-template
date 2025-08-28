import env from '@/config';

/**
 ** Generates HTML page containing Swagger UI for the provided API specification.
 * @param {string} spec - The OpenAPI/Swagger specification as a JSON string.
 * @returns {string} The complete HTML string for rendering the API documentation.
 * @example
 * const apiHtml = ApiDocsTemplate(JSON.stringify(apiSpec));
 * console.log(apiHtml);
 */
const ApiDocsTemplate = (spec: string): string => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${env.APP_NAME} v${env.API_VERSION} API Docs</title>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link href="/assets/css/style.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.27.1/swagger-ui.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scroll-behavior: smooth;
        }
        @font-face {
            font-family: 'Inter';
            src: url('/assets/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype');
            font-weight: 100 900;
            font-style: normal;
        }
        @font-face {
            font-family: 'Inter';
            src: url('/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf') format('truetype');
            font-weight: 100 900;
            font-style: italic;
        }
        html,
        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
                scrollbar-width: none;
        }
        html::-webkit-scrollbar {
            display: none;
        }
        body::-webkit-scrollbar {
            display: none;
        }
        body {
            overflow-x: hidden !important;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        a,
        li,
        td,
        i,
        label,
        input,
        textarea,
        select,
        option,
        span,
        div,
        code,
        pre {
            font-style: normal !important;
            letter-spacing: normal !important;
            line-height: normal !important;
            font-weight: 500 !important;
        }
        input,
        input:focus,
        input::placeholder {
            outline: none !important;
            appearance: none !important;
        }
        input::placeholder {
            font-size: 900 !important;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
        }
        input:disabled {
            cursor: not-allowed !important;
            opacity: 0.5 !important;
        }
        button:hover {
            cursor: pointer !important;
        }
        button:disabled {
            cursor: not-allowed !important;
            opacity: 0.5 !important;
        }
        a {
            text-decoration: none !important;
            cursor: pointer !important;
            color: inherit !important;
        }
        #swagger-ui .topbar {
            display: none !important;
        }
        #swagger-ui .information-container {
            display: none !important;
        }
        .swagger-ui .opblock-body pre.microlight {
            background: #cccccc31 !important;
            border: 1px solid lightgray !important;
            border-radius: 8px !important;
        }
        .swagger-ui .dialog-ux .modal-ux {
            top: 1vh !important;
            transform: translate(-50%,0%) !important;
        }
    </style>
    </head>
    <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.27.1/swagger-ui-bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.27.1/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = () => {
            window.swaggerUI = SwaggerUIBundle({
                spec: ${spec},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                requestInterceptor: (req) => {
                    if (window && window.authSelectors && typeof window.authSelectors.authorized === 'function') {
                        const auths = window.authSelectors.authorized();
                        const cookieAuth = auths?.get("cookieAuth");
                        const token = cookieAuth?.get("value");
                        if (token) {
                            document.cookie = "token=" + token + "; path=/;";
                        }
                    }
                    req.credentials = "include";
                    return req;
                },
                persistAuthorization: true,
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                filter: true,
                showRequestDuration: true,
                displayRequestDuration: true,
                showExtensions: true,
                persistAuthorization: true,
                docExpansion: 'list',
                tagsSorter: 'alpha',
                showCommonExtensions: true,
            });
        };
    </script>
    <script src="/assets/js/script.js"></script>
    </body>
    </html>
  `;

export default ApiDocsTemplate;
