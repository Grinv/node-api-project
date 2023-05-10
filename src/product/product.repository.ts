import { Decimal } from '@prisma/client/runtime';
import { Prisma, ProductModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { IProductRepository } from './types/product.repository.interface';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductFindDto } from './dto/product-find.dto';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ title, color, description, price }: ProductCreateDto): Promise<ProductModel> {
		const data: Prisma.ProductModelCreateInput = { title, description };

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

		if (price) {
			data.price = new Decimal(price);
		}

		return this.prismaService.client.productModel.create({ data });
	}

	async find(data: ProductFindDto): Promise<ProductModel[]> {
		const query: Prisma.ProductModelWhereInput = {};

		if (data.title) {
			query.title = { contains: data.title };
		}

		if (data.description) {
			query.description = { contains: data.description };
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
