import { Request, Response, NextFunction} from 'express';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.validation';
import { BadRequestError, NotFoundError } from '@middlewares/errorHandler';
import { Next } from 'mysql2/typings/mysql/lib/parsers/typeCast';
import { data } from 'react-router-dom';

const userService = new UserService();

export class UserController {
	static async createUser(req: Request, res: Response, next: NextFunction){
		try {
			const validatedData = createUserSchema.parse(req.body);
			const user = await userService.createUser(validatedData);
			res.status(201).json(user);
		} catch (error) {
			next(error); // global error handler will catch this
		}
	}
	static async getAllUsers(req: Request, res: Response, next: NextFunction){
		try{
			const users = await userService.getAllUsers();
			res.status(200).json(users);
		} catch (error) {
			next(error);
		}
	}
	static async getUserById(req: Request, res: Response, next: NextFunction){
		try {
			const { id } = req.params;
			const users = await userService.getUserById(id);
			res.status(200).json(users);
		} catch (error) {
			next(error);
		}
	}

	static async updateUser(req: Request, res: Response, next: NextFunction){
		try {
			const {id} = req.params;
			// console.log(req.body)
			const validatedData = updateUserSchema.parse(req.body);

			if(!validatedData.name && !validatedData.email) {
				throw new BadRequestError('At least one of name or email must be provided for update');
			}
			console.log(validatedData)
			const user = await userService.updateUser(id, validatedData);
			res.status(200).json(user);
		} catch(error) {
			next(error);
		}
	}

	static async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await userService.deleteUser(id);
			res.status(204).send();
		}catch(error){
			next(error);
		}
	}
}