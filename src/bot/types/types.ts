import { Context, Scenes } from 'telegraf';

export interface MySessionScene extends Scenes.SceneSessionData {
	myProps: string;
}

export interface MySession extends Scenes.SceneSession<MySessionScene> {
	myProp: string;
	name: string;
	city: string;
}

export interface MyContext extends Context {
	props: string;
	session: MySession;
	scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
}
