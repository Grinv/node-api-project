import { Role } from '@prisma/client';
import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class UserUpdateDto {
	@IsOptional()
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsOptional()
	@IsString({ message: 'Неверно указан пароль' })
	password: string;

	@IsOptional()
	@IsString({ message: 'Неверно указано имя' })
	name: string;

	@IsOptional()
	@IsEnum(Role)
	role: Role;
}
