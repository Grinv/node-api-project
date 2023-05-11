import { WarehouseModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { IWarehouseRepository } from './types/warehouse.repository.interface';

@injectable()
export class WarehouseRepository implements IWarehouseRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async update(productId: number, quantity: number): Promise<WarehouseModel | null> {
		return this.prismaService.client.warehouseModel.upsert({
			where: {
				productId,
			},
			update: {
				quantity,
			},
			create: {
				productId,
				quantity,
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
