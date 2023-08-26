import LocalSession from 'telegraf-session-local';
import { injectable } from 'inversify';
import { IBotStorage } from './bot-storage.interface';

const LOCAL_STORAGE_FILE = 'shop-storage.json';

@injectable()
export class BotStorage implements IBotStorage {
	private storage: LocalSession<unknown>;

	constructor() {
		this.storage = new LocalSession({ database: LOCAL_STORAGE_FILE });
	}

	get instance(): LocalSession<unknown> {
		return this.storage;
	}
}
