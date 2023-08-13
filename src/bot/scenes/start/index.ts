import { Markup, Scenes } from 'telegraf';
import { SCENE } from '../../constants/scene';
import { ISceneBase } from '../../types/scene';
import { MyContext } from '../../types/types';

export class StartScene implements ISceneBase {
	private scene: Scenes.BaseScene<MyContext>;

	constructor() {
		this.scene = new Scenes.BaseScene<MyContext>(SCENE.START);
		this.init();
	}

	get instance(): Scenes.BaseScene<MyContext> {
		return this.scene;
	}

	init(): void {
		this.scene.action('products', (ctx) => {
			ctx.reply('Cорри, братан, пока не завезли 🤷‍♂️');
		});

		this.scene.action('cart', (ctx) => {
			ctx.reply('Cорри, братан, пока в разработке 🤷‍♂️');
		});

		this.scene.action('order', (ctx) => {
			ctx.reply('Cорри, братан, пока машин нет 🤷‍♂️');
		});

		this.scene.enter(async (ctx) => {
			ctx.reply(
				'Что ты желаешь?',
				Markup.inlineKeyboard([
					[
						Markup.button.callback('Покажи товары', 'products'),
						Markup.button.callback('Покажи корзину', 'cart'),
					],
					[Markup.button.callback('Оформить заказ', 'order')],
				]),
			);
		});
	}
}
