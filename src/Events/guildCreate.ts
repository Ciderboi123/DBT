import {Guild} from 'discord.js'

import {RunFunction} from '../Interfaces/Event';

export const run: RunFunction = async (client, guild: Guild) => {
	await client.registerSlashCommandGuild(guild);
};

export const name = 'guildCreate';
