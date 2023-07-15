import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import { ADMIN_CREDENTIALS, NEW_PRODUCT_TITLE, PRODUCT_DATA } from './variables';

let application: App;
let jwt: string;
let productId: string;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
	const login = await request(application.app).post('/users/login').send(ADMIN_CREDENTIALS);

	jwt = login.body.jwt;
});

describe('Products e2e', () => {
	it('Create product - error', async () => {
		const res = await request(application.app)
			.post('/product/create')
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(422);
	});

	it('Create product - success', async () => {
		const res = await request(application.app)
			.post('/product/create')
			.set('Authorization', `Bearer ${jwt}`)
			.send(PRODUCT_DATA);

		expect(res.statusCode).toBe(201);
	});

	it('Find product - get all products', async () => {
		const res = await request(application.app)
			.post('/product/find')
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.body).not.toBeUndefined();
	});

	it('Find product - get product', async () => {
		const res = await request(application.app)
			.post('/product/find')
			.set('Authorization', `Bearer ${jwt}`)
			.send({ title: PRODUCT_DATA.title });

		const product = res.body[0];
		expect(product).toMatchObject(PRODUCT_DATA);
		productId = product.id;
	});

	it('Get by ID - error', async () => {
		const res = await request(application.app)
			.get('/product/-1')
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(400);
	});

	it('Get by ID - success', async () => {
		const res = await request(application.app)
			.get(`/product/${productId}`)
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.body).toMatchObject(PRODUCT_DATA);
	});

	it('Update product - success', async () => {
		const res1 = await request(application.app)
			.patch(`/product/${productId}`)
			.set('Authorization', `Bearer ${jwt}`)
			.send({ title: NEW_PRODUCT_TITLE });

		expect(res1.statusCode).toBe(204);

		const res2 = await request(application.app)
			.get(`/product/${productId}`)
			.set('Authorization', `Bearer ${jwt}`);

		expect(res2.body.title).toEqual(NEW_PRODUCT_TITLE);
	});

	it('Delete product - success', async () => {
		const res = await request(application.app)
			.delete(`/product/${productId}`)
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(204);
	});
});

afterAll(async () => {
	await application.close();
});
