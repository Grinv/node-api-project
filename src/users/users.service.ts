import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './types/users.repository.interface';
import { IUserService } from './types/users.service.interface';
import { UserUpdateDto } from './dto/user-update.dto';
import cryptPassword from '../common/utils/cryptPassword';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User({ email, name });
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}

		const newUser = new User({
			email: existedUser.email,
			name: existedUser.name,
			passwordHash: existedUser.password,
		});
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async update(userId: number, user: UserUpdateDto): Promise<UserModel | null> {
		try {
			if (user.password) {
				const salt = this.configService.get('SALT');
				user.password = await cryptPassword(user.password, Number(salt));
			}
			return this.usersRepository.update(userId, user);
		} catch {
			return null;
		}
	}

	async delete(userId: number): Promise<UserModel | null> {
		return this.usersRepository.delete(userId);
	}
}
