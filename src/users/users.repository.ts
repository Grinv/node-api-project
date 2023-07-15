import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './types/users.repository.interface';
import { UserUpdateDto } from './dto/user-update.dto';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}

	async update(userId: number, data: UserUpdateDto): Promise<UserModel | null> {
		return this.prismaService.client.userModel.update({
			where: {
				id: userId,
			},
			data,
		});
	}

	async delete(id: number): Promise<UserModel | null> {
		return this.prismaService.client.userModel.delete({
			where: {
				id,
			},
		});
	}
}
