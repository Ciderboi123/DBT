import {Event} from "./Event";
import {Command} from "./Commands";

export interface Module {
	name: string;
	description: string;
	command?: Command;
	event?: Event;
	commands?: Command[];
	events?: Event[];
}