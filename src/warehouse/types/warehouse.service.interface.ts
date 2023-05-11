import { WarehouseModel } from '@prisma/client';

export interface IWarehouseService {
	update: (productId: number, quantity: number) => Promise<WarehouseModel | null>;
	get: (productId: number) => Promise<WarehouseModel | null>;
	delete: (productId: number) => Promise<WarehouseModel | null>;
}
