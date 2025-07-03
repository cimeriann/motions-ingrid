import express from 'express';
import env from '@config/index';
import cors from 'cors';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import userRouter from '@features/users/user.router';
import authRouter from '@features/auth/auth.router';
import errorHandler from '@middlewares/errorHandler';
// import { configDotenv } from 'dotenv';

// configDotenv();

const app = express();


// Middleware
// use body parser to parse JSON and URL-encoded data
app.use(cors());
app.use(helmet());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const PORT = env.PORT || 3000;

console.log(PORT)
// routes
// app.use((req, res, next) => {
// 	console.log("req.body: ", req.body);
// 	// res.status(200).json({message: 'this works' });
// 	next();
// })
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);


app.use((req, res, next) => {
	console.log("req.body: ", req.body);
	res.status(404).json({message: 'Route Not Found' });
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;