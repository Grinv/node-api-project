import { Scenes } from 'telegraf';
import { MyContext } from './types';

export interface ISceneBase {
	readonly instance: Scenes.BaseScene<MyContext>;
	init(): void;
}
