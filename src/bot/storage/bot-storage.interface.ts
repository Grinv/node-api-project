import LocalSession from 'telegraf-session-local';

export interface IBotStorage {
	readonly instance: LocalSession<unknown>;
}
