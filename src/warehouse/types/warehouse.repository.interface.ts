import { WarehouseModel } from '@prisma/client';
import { IQuantity } from './warehouse.service.interface';

export interface IWarehouseRepository {
	update: (productId: number, quantity: IQuantity) => Promise<WarehouseModel | null>;
	get: (productId: number) => Promise<WarehouseModel | null>;
	delete: (productId: number) => Promise<WarehouseModel | null>;
}
