import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ProductFindDto {
	@IsOptional()
	@IsNumber(undefined, { message: 'Неверно указан цвет' })
	colorId?: number;

	@IsOptional()
	@IsString({ message: 'Неверно указано название' })
	title?: string;

	@IsOptional()
	text?: string;

	@IsOptional()
	@IsNumber(undefined, { message: 'Неверно указана цена' })
	price?: number;
}
