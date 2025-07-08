import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import env from '@config/index';
import { UnauthorizedError } from '@middlewares/errorHandler';
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";

interface JwtPayload{
	id: string;
	email: string;
}

const authMiddleWare = ( req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if(!authHeader || !authHeader.startsWith('Bearer ')){
		return next(new UnauthorizedError('No token provided'));
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		req.body = decoded;
		next();
	}catch(error){
		return next(new UnauthorizedError('Invalid or expired Token'));
	}
};

export default authMiddleWare;