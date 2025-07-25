import { createLogger, format, transports } from 'winston';
import { addColors } from 'winston/lib/winston/config';

addColors({
	error: 'red',
	warn: 'yellow',
	info: 'green',
	debug: 'blue',
})
const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf(({ level, message, timestamp, stack }) => {
					return `${timestamp} [${level}]: ${stack || message}`;
				})
			)
		}),
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
	],
	exitOnError: false,
});

export default logger;