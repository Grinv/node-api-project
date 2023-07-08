import { ProductModel } from '@prisma/client';
import { IProductCreate, IProductFind } from './product.repository.interface';

export interface IProductService {
	create: (dto: IProductCreate) => Promise<ProductModel | null>;
	find: (dto: IProductFind) => Promise<ProductModel[]>;
	getById: (productId: number) => Promise<ProductModel | null>;
	update: (productId: number, data: ProductModel) => Promise<ProductModel | null>;
	delete: (productId: number) => Promise<ProductModel | null>;
}
