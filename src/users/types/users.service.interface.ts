import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserUpdateDto } from '../dto/user-update.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	update: (userId: number, data: UserUpdateDto) => Promise<UserModel | null>;
	delete: (userId: number) => Promise<UserModel | null>;
}
