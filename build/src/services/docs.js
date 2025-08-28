import os from 'os';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import env from '../config/index.js';
// Get the network and local IPs
const networkInterfaces = os.networkInterfaces();
const ips = Object.values(networkInterfaces)
    .flat()
    .filter(details => details && details.family === 'IPv4' && !details.internal)
    .map(details => details?.address);
const servers = env.NODE_ENV === 'development'
    ? [
        {
            url: `http://localhost:${env.PORT}/api/v${env.API_VERSION}/`,
            description: 'Local Server',
        },
        ...ips.map(ip => ({
            url: `http://${ip}:${env.PORT}/api/v${env.API_VERSION}/`,
            description: 'Network Server',
        })),
        {
            url: `https://typescript-vercel-template.vercel.app/api/v${env.API_VERSION}/`,
            description: 'Live Server',
        },
    ]
    : [
        {
            url: `https://typescript-vercel-template.vercel.app/api/v${env.API_VERSION}/`,
            description: 'Live Server',
        },
    ];
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Template',
            version: `${env.API_VERSION}.0.0`,
            description: `Template v${env.API_VERSION} API Docs`,
            contact: {
                name: 'Template',
                url: env.FRONTEND_URL,
                email: env.APP_NAME,
            },
        },
        servers,
    },
    // Path to the API specs
    apis: [
        path.join(path.resolve(), env.NODE_ENV === 'development' ? '/src/routes/*.ts' : '/build/src/routes/*.js'),
    ],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
//# sourceMappingURL=docs.js.map