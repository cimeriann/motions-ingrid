import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	PORT: z.string().default('3000'),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(10),
	VERSION: z.string()
});

const env = envSchema.parse(process.env);
// console.log(env)
export default env;