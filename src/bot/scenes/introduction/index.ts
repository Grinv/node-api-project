import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { SCENE } from '../../constants/scene';
import { ISceneBase } from '../../types/scene';
import { MyContext } from '../../types/types';

export class IntroductionScene implements ISceneBase {
	private scene: Scenes.BaseScene<MyContext>;

	constructor() {
		this.scene = new Scenes.BaseScene<MyContext>(SCENE.INTRODUCTION);
		this.init();
	}

	get instance(): Scenes.BaseScene<MyContext> {
		return this.scene;
	}

	init(): void {
		this.scene.enter(async (ctx) => {
			await ctx.reply('Кажется, вы у нас впервые. Давайте немного узнаем про вас...');
			await ctx.reply('Введите имя');
		});

		this.scene.leave((ctx) =>
			ctx.reply('Отлично. Все данные записаны. Добро пожаловать на склад!'),
		);

		this.scene.on(message('text'), async (ctx, next) => {
			if (ctx.session.name) {
				ctx.session.city = ctx.message.text;
				await ctx.reply(
					`Ты живёшь в городе ${ctx.message.text}. Хотя я мог вычислить тебя и по IP.`,
				);
				ctx.scene.enter(SCENE.START);
			} else {
				ctx.state.name = ctx.message.text;
				await ctx.reply(`Привет, ${ctx.message.text}`);
				ctx.session.name = ctx.message.text;
				ctx.reply('А теперь введи свой город');
			}
		});
	}
}
