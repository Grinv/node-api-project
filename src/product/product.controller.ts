import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { ProductIdGuard } from '../common/middleware/productId.guard';
import { IProductController } from './types/product.controller.interface';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductFindDto } from './dto/product-find.dto';
import { IProductService } from './types/product.service.interface';

@injectable()
export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ProductService) private productService: IProductService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(ProductCreateDto)],
			},
			{
				path: '/find',
				method: 'post',
				func: this.find,
				middlewares: [new ValidateMiddleware(ProductFindDto)],
			},
			{
				path: '/:productId',
				method: 'get',
				func: this.getById,
				middlewares: [new ProductIdGuard()],
			},
			{
				path: '/:productId',
				method: 'patch',
				func: this.update,
				middlewares: [new ProductIdGuard(), new ValidateMiddleware(ProductUpdateDto)],
			},
			{
				path: '/:productId',
				method: 'delete',
				func: this.delete,
				middlewares: [new ProductIdGuard()],
			},
		]);
	}

	async create(
		{ body }: Request<{}, {}, ProductCreateDto>,
		res: Response<void>,
		next: NextFunction,
	): Promise<void> {
		const newProduct = await this.productService.create(body);

		if (!newProduct) {
			return next(new HTTPError(422, 'Произошла ошибка при создании продукта'));
		}
		this.send(res, 201, newProduct);
	}

	async find(
		{ body }: Request<{}, {}, ProductFindDto>,
		res: Response<void>,
		next: NextFunction,
	): Promise<void> {
		const products = await this.productService.find(body);

		if (!products) {
			return next(new HTTPError(400, 'Неверные параметры'));
		}

		this.ok(res, products);
	}

	async getById(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const product = await this.productService.getById(Number(req.params.productId));

		if (!product) {
			return next(new HTTPError(400, 'Такого продукта не существует'));
		} else {
			this.ok(res, product);
		}
	}

	async update(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const product = await this.productService.update(Number(req.params.productId), req.body);

		if (!product) {
			return next(
				new HTTPError(400, 'Такого продукта не существует или параметры указаны неверно'),
			);
		} else {
			this.send(res, 204, null);
		}
	}

	async delete(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const product = await this.productService.delete(Number(req.params.productId));

		if (!product) {
			return next(new HTTPError(400, 'Такого продукта не существует'));
		} else {
			this.send(res, 204, null);
		}
	}
}
