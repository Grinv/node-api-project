import { WarehouseModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IWarehouseRepository } from './types/warehouse.repository.interface';
import { IWarehouseService } from './types/warehouse.service.interface';

@injectable()
export class WarehouseService implements IWarehouseService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.WarehouseRepository) private warehouseRepository: IWarehouseRepository,
	) {}

	async update(productId: number, quantity: number): Promise<WarehouseModel | null> {
		try {
			return await this.warehouseRepository.update(productId, quantity);
		} catch {
			return null;
		}
	}

	async get(productId: number): Promise<WarehouseModel | null> {
		return await this.warehouseRepository.get(productId);
	}

	async delete(productId: number): Promise<WarehouseModel | null> {
		try {
			return await this.warehouseRepository.delete(productId);
		} catch {
			return null;
		}
	}
}
