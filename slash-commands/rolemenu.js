const { SlashCommandBuilder } = require('discord.js');
const fn = require('../modules/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolemenu')
		.setDescription('Send the role selection menu in the current channel'),
	async execute(interaction) {
		await interaction.deferReply().catch(err => console.error(err));
		await interaction.editReply(fn.builders.embeds.treeRoleMenu()).catch(err => console.error(err));
	},
};