import { Role } from '@prisma/client';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class PermissionGuard implements IMiddleware {
	#roles: Role[] = [];

	constructor(roles: Role[]) {
		this.#roles = roles;
	}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.role && this.#roles.includes(req.role)) {
			return next();
		}
		res.status(403).send({ error: 'Недостаточно прав' });
	}
}
