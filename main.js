/* eslint-disable no-case-declarations */
/* eslint-disable indent */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

// Discord.JS
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});

// Various imports
const fn = require('./modules/functions.js');
const strings = require('./data/strings.json');
const isDev = process.env.DEBUG;
const statusChannelId = process.env.STATUSCHANNELID;

client.once('ready', () => {
	// Build a collection of slash commands for the bot to use
	fn.collectionBuilders.slashCommands(client);
	console.log('Ready!');
	client.channels.fetch(statusChannelId).then(channel => {
		channel.send(`${new Date().toISOString()} -- Ready`);
	}).catch(err => {
		console.error("Error sending status message: " + err);
	});
});

// slash-commands
client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const { commandName } = interaction;

		if (client.slashCommands.has(commandName)) {
			client.slashCommands.get(commandName).execute(interaction);
		} else {
			interaction.reply('Sorry, I don\'t have access to that command.').catch(err => console.error(err));
			console.error('Slash command attempted to run but not found: /' + commandName);
		}
	} else if (interaction.isButton()) {
		switch (interaction.component.customId) {
			case 'acceptrules':
				await fn.buttonHandlers.acceptRules(interaction).catch(err => {
					console.error("Error handling rule acceptance: " + err);
				});
				break;
			case 'waterpingrole':
				await fn.buttonHandlers.waterPing(interaction).catch(err => {
					console.error("Error handling water ping button: " + err);
				});
				break;
			case 'fruitpingrole':
				await fn.buttonHandlers.fruitPing(interaction).catch(err => {
					console.error("Error handling fruit ping button: " + err);
				});
				break;
			default:
				break;
		}
	}
});

client.login(token);