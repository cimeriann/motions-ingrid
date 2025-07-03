import { Request, Response, NextFunction } from "express";
import { AuthService } from './auth.service';
import { loginSchema } from "./auth.validation";


const authService = new AuthService();


export class AuthController {
	static async login(req: Request, res: Response, next: NextFunction){
		try {
			// console.log(req.body);
			const validatedData = loginSchema.parse(req.body);
			const token = await authService.login(validatedData.email, validatedData.password);
			res.status(200).json({ token });
		} catch (error) {
			next(error)
		}
	}
}