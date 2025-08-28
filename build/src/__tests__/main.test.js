import request from 'supertest'; // Supertest is great for testing Express routes
import mongoose from 'mongoose'; // To disconnect MongoDB connection after all tests
import { serverInstance as server } from '../index.js'; // Import Express app
import { cronJobs } from '../services/index.js'; // To stop cron jobs after all tests
afterAll(done => {
    void server.then(({ http, io }) => {
        cronJobs.stop(); // Stop cron jobs
        void mongoose.connection
            .close() // Disconnect MongoDB
            .then(() => {
            // eslint-disable-next-line no-console
            console.log('MongoDB connection closed');
            void io.close(); // Close Socket.IO
            http.close(() => {
                done();
            }); // Ensure the server is properly closed after all tests
        })
            .catch(_ => {
            // eslint-disable-next-line no-console
            console.log('MongoDB connection closing error');
            void io.close(); // Close Socket.IO
            http.close(done); // Ensure the server is properly closed after all tests
        });
    });
}, 60000);
describe('App Test', () => {
    it('should return 200 OK when server is running', async () => {
        const { http } = await server;
        const res = await request(http).get('/');
        expect(res.statusCode).toEqual(200); // Check if response status is 200
        expect(res.body.success).toBe(true); // Check if response body is true
    }, 60000);
});
//# sourceMappingURL=main.test.js.map