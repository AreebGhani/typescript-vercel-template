import cors from 'cors';
type CORSResponse = (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader: (key: string, value: string) => any;
    end: () => any;
}, next: (err?: any) => any) => void;
/**
 ** Applies CORS middleware to the provided Express application with restricted settings.
 * - `origin`: Allowed origins are read from the environment variable `ORIGINS`, split by commas.
 * - `methods`: Restricts allowed HTTP methods to GET, HEAD, OPTIONS, PUT, PATCH, POST and DELETE.
 * - `credentials`: Enables credentials support for cross-origin requests.
 * @returns A CORS middleware response configured with restricted settings.
 */
export declare const restricted: () => CORSResponse;
/**
 ** Creates a CORS middleware configuration that allows requests from any origin.
 * - `origin`: Allows all origins (`'*'`).
 * - `methods`: Permits HTTP methods GET, HEAD, OPTIONS, PUT, PATCH, POST and DELETE.
 * - `allowedHeaders`: allow all headers.
 * - `credentials`: Disables credentials support.
 * Additionally, it sets the `Access-Control-Allow-Origin` and
 * `Cross-Origin-Resource-Policy` headers to further enable cross-origin access.
 * @returns A CORS middleware response configured with restricted settings.
 */
export declare const open: () => CORSResponse;
export {};
