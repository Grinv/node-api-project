import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { ProductIdGuard } from '../common/middleware/productId.guard';
import { IWarehouseController } from './types/warehouse.controller.interface';
import { WarehouseUpdateDto } from './dto/warehouse-update.dto';
import { IWarehouseService } from './types/warehouse.service.interface';
import { AuthGuard } from '../common/middleware/auth.guard';

@injectable()
export class WarehouseController extends BaseController implements IWarehouseController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.WarehouseService) private warehouseService: IWarehouseService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/:productId',
				method: 'put',
				func: this.update,
				middlewares: [
					new AuthGuard(),
					new ProductIdGuard(),
					new ValidateMiddleware(WarehouseUpdateDto),
				],
			},
			{
				path: '/:productId',
				method: 'get',
				func: this.get,
				middlewares: [new AuthGuard(), new ProductIdGuard()],
			},
			{
				path: '/:productId',
				method: 'delete',
				func: this.delete,
				middlewares: [new AuthGuard(), new ProductIdGuard()],
			},
		]);
	}

	async update(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const warehouseData = await this.warehouseService.update(Number(req.params.productId), {
			quantity: Number(req.body.quantity),
		});

		if (!warehouseData) {
			return next(
				new HTTPError(400, 'Такого продукта не существует или параметры указаны неверно'),
			);
		} else {
			this.send(res, 204, null);
		}
	}

	async get(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const warehouseData = await this.warehouseService.get(Number(req.params.productId));

		if (!warehouseData) {
			return next(new HTTPError(400, 'Такого продукта не существует'));
		}

		this.ok(res, warehouseData);
	}

	async delete(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const warehouseData = await this.warehouseService.delete(Number(req.params.productId));

		if (!warehouseData) {
			return next(new HTTPError(400, 'Такого продукта не существует'));
		}

		this.send(res, 204, null);
	}
}
