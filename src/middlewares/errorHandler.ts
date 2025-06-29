import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
	statusCode: number;
	constructor(message: string, statusCode: number = 500) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string = 'Resource not found'){
		super(message, 404);
	}
}
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
export class BadRequestError extends ApiError {
	constructor(message: string = 'Bad Request'){
		super(message, 400);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string = 'Forbidden'){
		super(message, 403);
	}
}

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if(err instanceof ApiError){
		return res.status(err.statusCode).json({ message: err.message });
	}

	if('code' in err && err.code === 'P2002'){
		return res.status(409).json({ message: 'Duplicate entry'});
	}
	console.error('Unhandled error:', err)

	res.status(500).json({ message: 'Something went wrong!'});
}

export default errorHandler;