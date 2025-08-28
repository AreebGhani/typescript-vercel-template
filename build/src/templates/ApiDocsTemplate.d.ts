/**
 ** Generates HTML page containing Swagger UI for the provided API specification.
 * @param {string} spec - The OpenAPI/Swagger specification as a JSON string.
 * @returns {string} The complete HTML string for rendering the API documentation.
 * @example
 * const apiHtml = ApiDocsTemplate(JSON.stringify(apiSpec));
 * console.log(apiHtml);
 */
declare const ApiDocsTemplate: (spec: string) => string;
export default ApiDocsTemplate;
