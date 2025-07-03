import env from '@config/index';
import prisma from '@utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, NotFoundError } from '@middlewares/errorHandler';


export class AuthService {
	async login(email: string, password: string): Promise<string> {
		const user = await prisma.user.findUnique({ where: {email}});

		if (!user) {
			throw new UnauthorizedError('Invalid credentials.')
		}
		const token = jwt.sign(
			{id: user.id, email: user.email },
			env.JWT_SECRET,
			{ expiresIn: '1h'}
		);

		return token;
	}
}