import { UserModel } from '@prisma/client';
import { User } from '../user.entity';
import { UserUpdateDto } from '../dto/user-update.dto';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
	update: (userId: number, data: UserUpdateDto) => Promise<UserModel | null>;
	delete: (userId: number) => Promise<UserModel | null>;
}
