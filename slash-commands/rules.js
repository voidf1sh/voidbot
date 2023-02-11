const { SlashCommandBuilder } = require('discord.js');
const fn = require('../modules/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Send the rules in the current channel'),
	async execute(interaction) {
		try {
			await interaction.deferReply().catch(err => console.error(err));
			await interaction.editReply(fn.builders.embeds.rules());
		} catch(err) {
			console.error(err);
		}

	},
};