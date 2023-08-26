import { Markup, Scenes } from 'telegraf';
import { SCENE } from '../../constants/scene';
import { ISceneBase } from '../../types/scene';
import { MyContext } from '../../types/types';
import { IProductService } from '../../../product/types/product.service.interface';
import { ProductModel } from '@prisma/client';

export class ProductsScene implements ISceneBase {
	private scene: Scenes.BaseScene<MyContext>;
	productService: IProductService;

	constructor(productService: IProductService) {
		this.scene = new Scenes.BaseScene<MyContext>(SCENE.PRODUCTS);
		this.productService = productService;
		this.init();
	}

	get instance(): Scenes.BaseScene<MyContext> {
		return this.scene;
	}

	async showProduct(ctx: MyContext, product: ProductModel): Promise<void> {
		await ctx.replyWithHTML(
			this.getProductInfo(product),
			Markup.inlineKeyboard([[Markup.button.callback('Добавить в корзину', `add ${product.id}`)]]),
		);
	}

	getProductInfo(product: ProductModel): string {
		return [
			`<b>Название:</b> ${product.title}`,
			`<b>Описание:</b> ${product.description}`,
			`<b>Цвет:</b> ${product.colorId}`,
			`<b>Цена:</b> ${product.price}`,
		].join('\n');
	}

	init(): void {
		this.scene.action(/add (.+)/, (ctx) => {
			const productId = Number(ctx.match[1]);

			if (Array.isArray(ctx.session.products)) {
				ctx.session.products.push(productId);
			} else {
				ctx.session.products = [productId];
			}

			ctx.reply('Добавлено в корзину');
		});

		this.scene.action('cart', (ctx) => {
			ctx.scene.enter(SCENE.CART);
		});

		this.scene.action('leave', (ctx) => {
			ctx.scene.enter(SCENE.START);
		});

		this.scene.enter(async (ctx) => {
			const products = await this.productService.find({});
			await products.forEach(async (product) => await this.showProduct(ctx, product));
			console.log(products);
			ctx.replyWithHTML(
				'<b>Какие дальнейшие действия?</b>',
				Markup.inlineKeyboard([
					[
						Markup.button.callback('Добавить в корзину', 'leave'),
						Markup.button.callback('Оформить заказ', 'cart'),
					],
					[Markup.button.callback('Назад', 'leave')],
				]),
			);
		});
	}
}
