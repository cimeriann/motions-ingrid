import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from '@config/index'
import userRouter from '@features/users/user.router';
import authRouter from '@features/auth/auth.router'
import errorHandler from '@middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = env.PORT || 3000;

// routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.use((req, res, next) => {
	res.status(404).json({message: 'Not Found' });
})
// Ensure errorHandler has the correct signature
app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;