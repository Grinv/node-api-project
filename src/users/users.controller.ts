import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './types/users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './types/users.service.interface';
import { AuthGuard } from '../common/middleware/auth.guard';
import { Role } from '@prisma/client';
import { UserUpdateDto } from './dto/user-update.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/:userId',
				method: 'patch',
				func: this.update,
				middlewares: [new AuthGuard(), new ValidateMiddleware(UserUpdateDto)],
			},
			{
				path: '/:userId',
				method: 'delete',
				func: this.delete,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(req.body.email);

		if (!userInfo) {
			return next(new HTTPError(400, `Пользователя с email ${req.body} не существует`, 'login'));
		}

		const isPasswordValid = await this.userService.validateUser(req.body);

		if (!isPasswordValid) {
			return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
		}

		const jwt = await this.signJWT(req.body.email, userInfo.role, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.send(res, 201, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	async update(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const user = await this.userService.update(Number(req.params.userId), req.body);

		if (!user) {
			return next(new HTTPError(400, 'Такого юзера не существует или параметры указаны неверно'));
		} else {
			this.send(res, 204, null);
		}
	}

	async delete(req: Request, res: Response<void>, next: NextFunction): Promise<void> {
		const user = await this.userService.delete(Number(req.params.userId));

		if (!user) {
			return next(new HTTPError(400, 'Такого юзера не существует'));
		} else {
			this.send(res, 204, null);
		}
	}

	private signJWT(email: string, role: Role, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					role,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
