import { ProductModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ProductCreateDto } from './dto/ProductCreateDto';
import { ProductFindDto } from './dto/ProductFindDto';
import { IConfigService } from '../config/config.service.interface';
import { IProductRepository } from './types/product.repository.interface';
import { IProductService } from './types/product.service.interface';

@injectable()
export class ProductService implements IProductService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ProductRepository) private productRepository: IProductRepository,
	) {}

	async create(product: ProductCreateDto): Promise<ProductModel | null> {
		const newProduct = await this.productRepository.create(product);
		return newProduct;
	}

	async find(data: ProductFindDto): Promise<ProductModel[]> {
		return await this.productRepository.find(data);
	}

	async getById(productId: number): Promise<ProductModel | null> {
		return await this.productRepository.getById(productId);
	}

	async update(productId: number, product: ProductModel): Promise<ProductModel | null> {
		try {
			return await this.productRepository.update(productId, product);
		} catch {
			return null;
		}
	}

	async delete(productId: number): Promise<ProductModel | null> {
		try {
			return await this.productRepository.delete(productId);
		} catch {
			return null;
		}
	}
}
