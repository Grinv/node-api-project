import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { SwaggerController } from './swagger/swagger.controller';
import { ISwaggerController } from './swagger/swagger.controller.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { IUserController } from './users/types/users.controller.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/types/users.repository.interface';
import { UserService } from './users/users.service';
import { IUserService } from './users/types/users.service.interface';
import { ProductController } from './product/product.controller';
import { IProductController } from './product/types/product.controller.interface';
import { IProductService } from './product/types/product.service.interface';
import { ProductService } from './product/product.service';
import { IProductRepository } from './product/types/product.repository.interface';
import { ProductRepository } from './product/product.repository';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IProductController>(TYPES.ProductController).to(ProductController);
	bind<IProductService>(TYPES.ProductService).to(ProductService);
	bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<ISwaggerController>(TYPES.SwaggerController).to(SwaggerController).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
