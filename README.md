# Typescript Vercel Template

[**Template Server**](https://typescript-vercel-template.vercel.app/) is the backend API server for the Typescript Vercel Template project. This server is built using modern technologies and follows best practices to ensure security, scalability, and flexibility.

## Introduction

This Template Server is built with Node.js and Express, using TypeScript for static typing and improved developer experience. This API handles user authentication, file uploads, real-time communication, and more. It integrates with several third-party services like S3 for image handling and Nodemailer for email notifications.

## Features

- **Authentication**: Secure authentication with JWT (JSON Web Tokens) and bcrypt for password hashing.
- **File Uploads**: Handle image uploads using Multer and S3 for cloud storage.
- **Real-time Communication**: Integrates Socket.io for real-time, bidirectional communication.
- **Data Validation**: Utilizes Mongoose for data modeling and validation with MongoDB.
- **Email Notifications**: Sends email notifications using Nodemailer.
- **Swagger Documentation**: Generates Swagger documentation for API endpoints.
- **TypeScript**: Benefit from static typing with TypeScript for better development experience.
- **Testing**: Comprehensive testing using Jest.
- **Code Formatting & Linting**: Ensures code quality with Prettier and ESLint.
- **Commit Standards**: Uses Commitlint and Commitizen for standardized and conventional commits.
- **Performance Optimization**: Automatically optimize fonts and images to ensure fast load times.
- **Deployment**: Easily deployable on any Node.js compatible hosting service.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB](https://www.mongodb.com/) (Ensure MongoDB is running)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AreebGhani/typescript-vercel-template.git
   ```

2. Navigate to the project directory:

   ```bash
   cd typescript-vercel-template
   ```

3. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Usage

1. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Deployment

This project is configured to be deployed on [Vercel](https://vercel.com/dashboard).

#### 1. One-time Setup

1. Install the Vercel CLI (globally):

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Link your local project to a Vercel project:

   ```bash
   vercel link
   ```

#### 2. Environment Variables

Vercel does **not** deploy `.env.*` files.
You must configure your secrets in the **Vercel Dashboard → Project → Settings → Environment Variables**.
Locally, you can still use `.env.development`, `.env.production`, etc.

#### 3. Deploy

To build and deploy the project in one step, run:

   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

That script will:

1. Run the TypeScript build
2. Call the Vercel CLI to deploy
3. After successful deployment, Vercel will return a URL like: ``` https://your-app-name.vercel.app ```
4. Add the following in **Vercel Dashboard → Project Settings → Build & Deployment → Project Settings**:
   1. Framework Preset to "Other"
   2. Build Command to "npm run build"
   3. Output Directory to "."
   4. Install Command to "npm install"
   5. Deployment Command to "None".

### Scripts

1. **start**  
   Starts the server in production mode with `NODE_ENV=production`, module resolution, and all paths pre-resolved via `scripts/path.js`. You can run it using `npm start` or `yarn start`

2. **build**  
   Cleans the `build` directory and compiles the TypeScript project with alias path resolution. You can run it using`npm run build` or `yarn build`

3. **build:docs**  
   Compiles the project using tsc -b and builds the documentation site using Vite with the docs/vite.config.ts configuration. You can run it using `npm run build:docs` or `yarn build:docs`

4. **dev**  
   Runs the development server with `nodemon` and environment setup for easier debugging. You can run it using `npm run dev` or `yarn dev`

5. **dev:docs**  
   Starts the development server for documentation using Vite with the docs/vite.config.ts configuration. You can run it using `npm run dev:docs` or `yarn dev:docs`

6. **deploy**  
   Deploys the project using vercel. You can run it using `npm run deploy` or `yarn deploy`

7. **prepare**  
   Prepares Git hooks using Husky. Typically triggered automatically during install. You can run it using `npm run prepare` or `yarn prepare`

8. **lint**  
   Automatically fixes linting issues using ESLint. You can run it using `npm run lint:fix` or `yarn lint:fix`

9. **lint:check**  
   Checks the codebase using ESLint for issues (read-only). You can run it using `npm run lint` or `yarn lint`

10. **format**  
    Formats all supported files using Prettier. You can run it using `npm run format` or `yarn format`

11. **format:check**  
    Checks for formatting issues using Prettier without applying fixes. You can run it using `npm run format:check` or `yarn format:check`

12. **test**  
    Runs Jest tests with coverage, module compatibility, and debugging flags. You can run it using `npm run test` or `yarn test`

13. **test:watch**  
    Runs Jest in watch mode for continuous testing. You can run it using `npm run test:watch` or `yarn test:watch`

14. **commit**  
    Formats and lints code, stages changes, and runs an interactive commit prompt via `git-cz`. You can run it using `npm run commit` or `yarn commit`

15. **lint-staged**  
    Runs ESLint and Prettier only on staged files before a commit. You can run it using `npm run lint-staged` or `yarn lint-staged`

### Technologies Used

- Node.js
- Express.js
- TypeScript
- Mongoose (MongoDB ORM)
- Socket.io (Real-time communication)
- JWT (Authentication)
- Multer & S3 (File uploads and image storage)
- Nodemailer (Email handling)
- Swagger (API documentation)

### API Documentation

This project uses [Swagger UI](https://swagger.io/) to provide an interactive API documentation interface. You can easily explore and test the available API endpoints using Swagger.

To access the API documentation:

1. Start the development server
2. Once the server is running, open your web browser and navigate to: `/api/v2/docs`

### Learn More

To learn more about Node.js and Express.js, take a look at the following resources:

- [ExpressJS Documentation](https://expressjs.com/) - Learn more about Express and how to build APIs.
- [Learn MongoDB](https://www.mongodb.com/docs/languages/javascript/) - Learn more about using MongoDB.

## Contributing

Contributions are welcome! If you have suggestions or found bugs, please open an issue or create a pull request.
