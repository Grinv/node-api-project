import { ProductModel } from '@prisma/client';
import { ProductCreateDto } from '../dto/product-create.dto';
import { ProductFindDto } from '../dto/product-find.dto';

export interface IProductService {
	create: (dto: ProductCreateDto) => Promise<ProductModel | null>;
	find: (dto: ProductFindDto) => Promise<ProductModel[]>;
	getById: (productId: number) => Promise<ProductModel | null>;
	update: (productId: number, data: ProductModel) => Promise<ProductModel | null>;
	delete: (productId: number) => Promise<ProductModel | null>;
}
