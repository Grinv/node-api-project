import { WarehouseModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IWarehouseRepository } from './types/warehouse.repository.interface';
import { IQuantity, IWarehouseService } from './types/warehouse.service.interface';

@injectable()
export class WarehouseService implements IWarehouseService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.WarehouseRepository) private warehouseRepository: IWarehouseRepository,
	) {}

	async update(productId: number, quantity: IQuantity): Promise<WarehouseModel | null> {
		return this.warehouseRepository.update(productId, quantity);
	}

	async get(productId: number): Promise<WarehouseModel | null> {
		return this.warehouseRepository.get(productId);
	}

	async delete(productId: number): Promise<WarehouseModel | null> {
		return this.warehouseRepository.delete(productId);
	}
}
