import { WarehouseModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { IWarehouseRepository } from './types/warehouse.repository.interface';
import { IQuantity } from './types/warehouse.service.interface';

@injectable()
export class WarehouseRepository implements IWarehouseRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async update(productId: number, quantity: IQuantity): Promise<WarehouseModel | null> {
		const { quantity: quantityData } = quantity;

		return this.prismaService.client.warehouseModel.upsert({
			where: {
				productId,
			},
			update: {
				quantity: quantityData,
			},
			create: {
				productId,
				quantity: quantityData,
			},
		});
	}

	async get(productId: number): Promise<WarehouseModel | null> {
		return this.prismaService.client.warehouseModel.findUnique({
			where: {
				productId,
			},
		});
	}

	async delete(productId: number): Promise<WarehouseModel | null> {
		return this.prismaService.client.warehouseModel.delete({
			where: {
				productId,
			},
		});
	}
}
