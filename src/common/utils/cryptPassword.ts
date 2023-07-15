import { hash } from 'bcryptjs';

export default function cryptPassword(pass: string, salt: number): Promise<string> {
	return hash(pass, salt);
}
