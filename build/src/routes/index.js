import express from 'express';
import env from '../config/index.js';
import { StatusCode, ApiPath } from '../constants/index.js';
const router = express.Router();
router.get('/', (req, res) => {
    res.status(StatusCode.OK).json({ success: true, path: ApiPath });
});
for (const [key, value] of Object.entries(ApiPath)) {
    try {
        if (key !== 'Base' && value && typeof value === 'object' && 'Base' in value) {
            void (async () => {
                const routes = await import(`./${key.toLowerCase()}.${env.NODE_ENV === 'production' ? 'js' : 'ts'}`);
                router.use(`${value.Base}`, routes.default || routes);
            })();
        }
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log(`\nFailed to load route module for "${key}" at: \x1b[31msrc/routes/${key.toLowerCase()}.${env.NODE_ENV === 'production' ? 'js' : 'ts'}\x1b[0m\n`);
        process.exit(1);
    }
}
export default router;
//# sourceMappingURL=index.js.map