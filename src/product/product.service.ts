import { ProductModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {
	IProductRepository,
	IProductCreate,
	IProductFind,
} from './types/product.repository.interface';
import { IProductService } from './types/product.service.interface';

@injectable()
export class ProductService implements IProductService {
	constructor(@inject(TYPES.ProductRepository) private productRepository: IProductRepository) {}

	async create(product: IProductCreate): Promise<ProductModel | null> {
		return this.productRepository.create(product);
	}

	async find(data: IProductFind): Promise<ProductModel[]> {
		return this.productRepository.find(data);
	}

	async getById(productId: number): Promise<ProductModel | null> {
		return this.productRepository.getById(productId);
	}

	async update(productId: number, product: ProductModel): Promise<ProductModel | null> {
		return this.productRepository.update(productId, product);
	}

	async delete(productId: number): Promise<ProductModel | null> {
		return this.productRepository.delete(productId);
	}
}
