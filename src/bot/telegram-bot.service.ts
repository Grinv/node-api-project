import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { ITelegramBotService } from './telegram-bot.interface';

const LOCAL_STORAGE_FILE = 'shop-storage.json';

@injectable()
export class TelegramBotService implements ITelegramBotService {
	private bot: Telegraf;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {
		this.bot = new Telegraf(this.configService.get('TELEGRAM_TOKEN'));
		this.bot.use(new LocalSession({ database: LOCAL_STORAGE_FILE }).middleware());
	}

	async init() {
		this.bot.start((ctx) => {
			ctx.reply('Welcome');
		});
		this.bot.launch();
		this.loggerService.log('🤖 🚀 bot started');
	}
}
