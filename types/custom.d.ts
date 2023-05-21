declare namespace Express {
	export interface Request {
		user: string;
		userId: number;
		role: 'ADMIN' | 'MANAGER';
	}
}
