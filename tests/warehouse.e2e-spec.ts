import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import { ADMIN_CREDENTIALS, PRODUCT_DATA, PRODUCT_QUANTITY } from './variables';

let application: App;
let jwt: string;
let productId: string;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
	const login = await request(application.app).post('/users/login').send(ADMIN_CREDENTIALS);

	jwt = login.body.jwt;

	await request(application.app)
		.post('/product/create')
		.set('Authorization', `Bearer ${jwt}`)
		.send(PRODUCT_DATA);

	const productRes = await request(application.app)
		.post('/product/find')
		.set('Authorization', `Bearer ${jwt}`)
		.send({ title: PRODUCT_DATA.title });

	const product = productRes.body[0];
	productId = product.id;
});

describe('Warehouse e2e', () => {
	it('Add product to warehouse - success', async () => {
		const res = await request(application.app)
			.put(`/warehouse/${productId}`)
			.set('Authorization', `Bearer ${jwt}`)
			.send({ quantity: PRODUCT_QUANTITY });
		expect(res.statusCode).toBe(204);
	});

	it('Get product quantity in warehouse - success', async () => {
		const res = await request(application.app)
			.get(`/warehouse/${productId}`)
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.body).toMatchObject({ productId, quantity: PRODUCT_QUANTITY });
	});

	it('Delete product from warehouse - success', async () => {
		const res = await request(application.app)
			.delete(`/warehouse/${productId}`)
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(204);
	});
});

afterAll(async () => {
	await request(application.app)
		.delete(`/product/${productId}`)
		.set('Authorization', `Bearer ${jwt}`);

	await application.close();
});
