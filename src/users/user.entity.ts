import { compare, hash } from 'bcryptjs';

export class User {
	private readonly _email;
	private _password;
	private readonly _name;

	constructor({
		email,
		name,
		passwordHash,
	}: {
		email: string;
		name?: string | null;
		passwordHash?: string;
	}) {
		this._email = email;
		this._name = name || '';
		this._password = passwordHash || '';
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._password);
	}
}
