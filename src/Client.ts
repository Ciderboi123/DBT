import Discord from 'discord.js';
import glob from 'glob';
import consola, { Consola } from 'consola';
import { promisify } from 'util';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { Command } from './Interfaces/Commands'
import { Event } from './Interfaces/Event'
import { Module } from "./Interfaces/Module";

import Config from './Configs/config.json'
import { Colors } from './Utils/Utils';

const globPromise = promisify(glob)

class Bot extends Discord.Client {
	public logger: Consola = consola;
	public commands: Discord.Collection<string, Command> = new Discord.Collection();
	public events: Discord.Collection<string, Event> = new Discord.Collection();
	public modules: Discord.Collection<string, Module> = new Discord.Collection();
	public config: typeof Config = Config;
	private _rest: REST;
	private slashCmdData: any[] = [];

	public constructor() {
		super({
			intents: Discord.Intents.FLAGS.GUILDS,
			shards: 'auto',
		});
	}

	public async start() {
		this._rest = new REST({ version: '9' }).setToken(this.config.Settings.Token);

		const CommandFiles: string[] = await globPromise(`${__dirname}/Commands/**/*{.ts,.js}`);
		CommandFiles.map(async (value: string) => {
			const file: Command = await import(value);
			if (file.name) {
				this.commands.set(file.name, file);
				this.slashCmdData.push(file.slashData);
			}
		});

		this.logger.debug(this.commands)

		const EventFiles: string[] = await globPromise(`${__dirname}/Events/**/*{.ts,.js}`);
		EventFiles.map(async (value: string) => {
			const file: Event = await import(value);
			this.events.set(file.name, file);
			this.on(file.name, file.run.bind(null, this));
		})

		await this.registerModules()

		await this.login(this.config.Settings.Token);
	}

	public async registerSlashCommandGuild(guild: Discord.Guild): Promise<void> {
		try {
			await this._rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), {
				body: this.slashCmdData
			});
		} catch (error) {
			this.logger.error(error.message)
		}
	}

	public async registerSlashCommand(): Promise<void> {
		try {
			for (let guilds of this.guilds.cache) {
				const guild = guilds[1]
				await this._rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), {
					body: this.slashCmdData
				});
			}
		} catch (error) {
			this.logger.error(error.message)
		}
	}

	public async registerModules(): Promise<void> {
		const ModuleFiles: string[] = await globPromise(`${__dirname}/Modules/**/*{.js,.ts}`);
		ModuleFiles.map(async (value: string) => {
			const file: Module = await import(value)

			try {

				if (file.commands) {
					file.commands.forEach((cmd) => {
						if (cmd.name) {
							this.commands.set(cmd.name, cmd);
							this.slashCmdData.push(cmd.slashData)
						}
					})
				} else if (file.command) {
					if (file.command.name) {
						this.commands.set(file.command.name, file.command);
						this.slashCmdData.push(file.command.slashData);
					}
				}

				// FIXME: FIX THIS SHIT
				// if (file.events.length > 0) {
				// 	file.events.forEach((event) => {
				// 		if (file.name) {
				// 			this.events.set(event.name, event)
				// 			this.on(event.name, event.run.bind(null, this));
				// 		}
				// 	})
				// }

				consola.info(`Loaded ${Colors.FgCyan + file.name + Colors.Reset} Module`)

			} catch (e) {
				this.logger.error(e.message)
			}

			this.modules.set(file.name, file)
		})
	}
}


export { Bot };