import { WarehouseModel } from '@prisma/client';

export interface IQuantity {
	quantity: number;
}

export interface IWarehouseService {
	update: (productId: number, quantity: IQuantity) => Promise<WarehouseModel | null>;
	get: (productId: number) => Promise<WarehouseModel | null>;
	delete: (productId: number) => Promise<WarehouseModel | null>;
}
