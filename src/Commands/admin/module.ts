import { RunSlashFunction } from '../../Interfaces/Commands'
import { SlashCommandBuilder } from '@discordjs/builders';

import * as Commands from '../../Configs/commands.json';
import { createEmbed } from '../../Utils/Utils';
import { GuildMember } from 'discord.js';

export const name = Commands.Admin.Module.Name
export const description = Commands.Admin.Module.Description
export const category = Commands.Admin.Module.Category
export const permission = Commands.Admin.Module.Permissions
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)

export const runSlash: RunSlashFunction = async (client, interaction) => {
  let embed = createEmbed({
    options: Commands.Admin.Module.Response.Embed,
    variables: [
      { searchFor: /{timestamp}/g, replaceWith: new Date() },
      { searchFor: /{ws-ping}/g, replaceWith: client.ws.ping },
      { searchFor: /{bot-ping}/g, replaceWith: new Date().valueOf() - interaction.createdAt.valueOf() }
    ]
  }, interaction.member as GuildMember)

  client.modules.forEach(m => {
    embed.addField(m.name, m.description, false)
  })

  await interaction.reply({
    embeds: [embed]
  })
}
