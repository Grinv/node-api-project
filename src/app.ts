import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { UserController } from './users/users.controller';
import { ProductController } from './product/product.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { SwaggerController } from './swagger/swagger.controller';
import generateSwaggerDocs from './swagger/utils/generateSwaggerDocs';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ProductController) private productController: ProductController,
		@inject(TYPES.SwaggerController) private swaggerController: SwaggerController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	async useRoutes(): Promise<void> {
		this.app.use('/users', this.userController.router);
		this.app.use('/product', this.productController.router);

		const swaggerDocs = await generateSwaggerDocs();
		this.app.use('/api-docs', swaggerUi.serveFiles(swaggerDocs), this.swaggerController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		await this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
