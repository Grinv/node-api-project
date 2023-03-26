import { ProductModel } from '@prisma/client';
import { ProductCreateDto } from '../dto/ProductCreateDto';
import { ProductFindDto } from '../dto/ProductFindDto';

export interface IProductRepository {
	create: (product: ProductCreateDto) => Promise<ProductModel>;
	find: (dto: ProductFindDto) => Promise<ProductModel[]>;
	getById: (productId: number) => Promise<ProductModel | null>;
	update: (productId: number, data: ProductModel) => Promise<ProductModel | null>;
	delete: (productId: number) => Promise<ProductModel | null>;
}
