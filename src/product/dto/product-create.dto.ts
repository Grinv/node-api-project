import { Decimal } from '@prisma/client/runtime';
import { IsString, IsOptional, IsNotEmpty, IsDecimal } from 'class-validator';

export class ProductCreateDto {
	@IsNotEmpty({ message: 'Не указано название' })
	@IsString({ message: 'Неверно указано название' })
	title: string;

	@IsOptional()
	@IsString({ message: 'Неверно указан цвет' })
	color?: string;

	@IsOptional()
	@IsString({ message: 'Неверно указано описание' })
	description?: string;

	@IsDecimal({}, { message: 'Неверно указана цена' })
	price: Decimal;
}
