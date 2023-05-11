import { IsOptional, IsNumber } from 'class-validator';

export class WarehouseUpdateDto {
	@IsOptional()
	@IsNumber(undefined, { message: 'Неверно указано количество товара' })
	quantity?: number;
}
