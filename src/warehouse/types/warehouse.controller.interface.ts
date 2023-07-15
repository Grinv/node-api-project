import { NextFunction, Request, Response } from 'express';

export interface IWarehouseController {
	update: (req: Request, res: Response, next: NextFunction) => void;
	get: (req: Request, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
}
