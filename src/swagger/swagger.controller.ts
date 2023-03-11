import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import swaggerUi from 'swagger-ui-express';
import specs from './annotations/swagger.json';

@injectable()
export class SwaggerController extends BaseController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: swaggerUi.setup(specs),
			},
		]);
		loggerService.log(
			'[SwaggerService] Swagger подключен по адресу http://localhost:8000/api-docs',
		);
	}
}
