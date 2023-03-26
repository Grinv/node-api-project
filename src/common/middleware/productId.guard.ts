import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class ProductIdGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		const productId = Number(req.params.productId);

		if (Number.isNaN(productId)) {
			res.status(400).send({ error: 'Некорректный id продукта' });
		}

		return next();
	}
}
