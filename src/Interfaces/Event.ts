import { Bot } from '../Client';

export interface RunFunction {
	(client: Bot, ...args: any[]): Promise<void>;
}

export interface Event {
	name: string;
	run: RunFunction;
}
