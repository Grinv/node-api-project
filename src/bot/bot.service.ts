import { Scenes, Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { IBotService } from './bot.interface';
import { IBotStorage } from './storage/bot-storage.interface';
import { StartScene } from './scenes/start';
import { IntroductionScene } from './scenes/introduction';
import { SCENE } from './constants/scene';
import { INTRODUTION_GIF } from './constants/gif';
import { MyContext } from './types/types';
import { ProductsScene } from './scenes/products';
import { IProductService } from '../product/types/product.service.interface';

@injectable()
export class BotService implements IBotService {
	private bot: Telegraf<MyContext>;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.BotStorage) private telegramBotStorage: IBotStorage,
		@inject(TYPES.ProductService) private productService: IProductService,
	) {
		this.initStorage();
		this.initStage();
	}

	initStorage(): void {
		this.bot = new Telegraf<MyContext>(this.configService.get('TELEGRAM_TOKEN'));
		this.bot.use(this.telegramBotStorage.instance.middleware());
	}

	initStage(): void {
		const scenes: Scenes.BaseScene<MyContext>[] = [
			new StartScene().instance,
			new IntroductionScene().instance,
			new ProductsScene(this.productService).instance,
		];

		const stage = new Scenes.Stage<MyContext>(scenes);
		this.bot.use(stage.middleware());

		this.bot.start(async (ctx) => {
			await ctx.replyWithAnimation(INTRODUTION_GIF);

			await ctx.replyWithMarkdownV2(
				'Добро пожаловать на скад передовой техники *"Мытищинские лухари"* 🤟',
			);

			if (ctx.session.name && ctx.session.city) {
				await ctx.replyWithMarkdownV2(
					`У нас твои данные\\:
				Твоё имя *${ctx.session.name}*
				Твой город *${ctx.session.city}*`,
				);
				ctx.scene.enter(SCENE.START);
			} else {
				ctx.scene.enter(SCENE.INTRODUCTION);
			}
		});
	}

	async start(): Promise<void> {
		this.bot.launch();
		this.loggerService.log('🤖 🚀 bot started');
	}
}
