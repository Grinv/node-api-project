import { Decimal } from '@prisma/client/runtime';
import { IsString, IsOptional, IsDecimal, IsNumber } from 'class-validator';

export class ProductUpdateDto {
	@IsOptional()
	@IsString({ message: 'Неверно указано название' })
	title?: string;

	@IsOptional()
	@IsNumber(undefined, { message: 'Неверно указан id цвета' })
	colorId?: number;

	@IsOptional()
	@IsString({ message: 'Неверно указано описание' })
	description?: string;

	@IsOptional()
	@IsDecimal({}, { message: 'Неверно указана цена' })
	price?: Decimal;
}
