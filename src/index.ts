import express from 'express';
import env from '@config/index';
import cors from 'cors';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import userRouter from '@features/users/user.router';
import authRouter from '@features/auth/auth.router';
import organizationRouter from '@features/organizations/organization.router';
import errorHandler from '@middlewares/errorHandler';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();


// Middleware
// use body parser to parse JSON and URL-encoded data
app.use(cors());
app.use(helmet());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const PORT = env.PORT || 3000;
const version = env.VERSION;

// console.log(version);

// console.log(PORT)
// routes
app.use(`/api/v${version}/users`, userRouter);
app.use(`/api/v${version}/auth`, authRouter);
app.use(`/api/v${version}/organization`, organizationRouter);

app.use((req, res, next) => {
	// console.log("req.body: ", req.body);
	res.status(404).json({message: 'Route Not Found' });
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;