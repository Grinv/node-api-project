import { Prisma, ProductModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import {
	IProductRepository,
	IProductCreate,
	IProductFind,
} from './types/product.repository.interface';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ title, color, description, price }: IProductCreate): Promise<ProductModel> {
		const data: Prisma.ProductModelCreateInput = { title, description, price };

		if (color) {
			data.color = {
				connectOrCreate: {
					where: {
						color,
					},
					create: {
						color,
					},
				},
			};
		}

		return this.prismaService.client.productModel.create({ data });
	}

	async find(data: IProductFind): Promise<ProductModel[]> {
		const query: Prisma.ProductModelWhereInput = {};

		if (data.title) {
			query.title = { in: data.title };
		}

		if (data.text) {
			query.title = { contains: data.text };
		}

		if (data.colorId) {
			query.colorId = { in: [data.colorId] };
		}

		if (data.price) {
			query.price = { in: [data.price] };
		}

		return this.prismaService.client.productModel.findMany({ where: query });
	}

	async getById(productId: number): Promise<ProductModel | null> {
		return this.prismaService.client.productModel.findUnique({
			where: {
				id: productId,
			},
		});
	}

	async update(productId: number, data: ProductModel): Promise<ProductModel | null> {
		return this.prismaService.client.productModel.update({
			where: {
				id: productId,
			},
			data,
		});
	}

	async delete(productId: number): Promise<ProductModel | null> {
		return this.prismaService.client.productModel.delete({
			where: {
				id: productId,
			},
		});
	}
}
