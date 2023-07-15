import { ProductModel } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export interface IProductRepository {
	create: (product: IProductCreate) => Promise<ProductModel>;
	find: (dto: IProductFind) => Promise<ProductModel[]>;
	getById: (productId: number) => Promise<ProductModel | null>;
	update: (productId: number, data: ProductModel) => Promise<ProductModel | null>;
	delete: (productId: number) => Promise<ProductModel | null>;
}

export interface IProductCreate {
	title: string;
	color?: string;
	description?: string;
	price: Decimal;
}

export interface IProductFind {
	colorId?: number;
	title?: string;
	text?: string;
	price?: number;
}
