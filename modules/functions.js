/* eslint-disable comma-dangle */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
const isDev = process.env.isDev;

// filesystem
const fs = require('fs');

// Discord.js
const Discord = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = Discord;

// Various imports from other files
const config = require('../data/config.json');
const strings = require('../data/strings.json');
const slashCommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));

const functions = {
	// Functions for managing and creating Collections
	collectionBuilders: {
		// Create the collection of slash commands
		slashCommands(client) {
			if (!client.slashCommands) client.slashCommands = new Discord.Collection();
			client.slashCommands.clear();
			for (const file of slashCommandFiles) {
				const slashCommand = require(`../slash-commands/${file}`);
				if (slashCommand.data != undefined) {
					client.slashCommands.set(slashCommand.data.name, slashCommand);
				}
			}
			if (isDev) console.log('Slash Commands Collection Built');
		}
	},
	builders: {
		actionRows: {
			acceptRules() {
				// Create the Action Row with the Button in it, to be sent with the Embed
				return new ActionRowBuilder()
					.addComponents(
						this.buttons.acceptRules()
					);
			},
			treeRoleMenu() {
				return new ActionRowBuilder()
					.addComponents(
						this.buttons.waterPing(),
						this.buttons.fruitPing()
					);
			},
			buttons: {
				acceptRules() {
					return new ButtonBuilder()
						.setCustomId('acceptrules')
						.setLabel(`${strings.emoji.confirm} Accept Rules`)
						.setStyle(ButtonStyle.Primary);
				},
				waterPing() {
					return new ButtonBuilder()
						.setCustomId('waterpingrole')
						.setLabel(strings.emoji.water)
						.setStyle(ButtonStyle.Primary);
				},
				fruitPing() {
					return new ButtonBuilder()
						.setCustomId('fruitpingrole')
						.setLabel(strings.emoji.fruit)
						.setStyle(ButtonStyle.Primary);
				}
			}
		},
		embeds: {
			helpEmbed(content, private) {
				const embed = new EmbedBuilder()
					.setColor(strings.embeds.color)
					.setTitle('Grow A Tree Analyzer Help')
					.setDescription(content)
					.setFooter({ text: strings.embeds.footer });
				const privateBool = private == 'true';
				const messageContents = { embeds: [embed], ephemeral: privateBool };
				return messageContents;
			},
			errorEmbed(content) {
				const embed = new EmbedBuilder()
					.setColor(0xFF0000)
					.setTitle('Error!')
					.setDescription(content)
					.setFooter({ text: strings.embeds.footer });
				const messageContents = { embeds: [embed], ephemeral: true };
				return messageContents;
			},
			info(content) {
				const embed = new EmbedBuilder()
					.setColor(0x8888FF)
					.setTitle('Information')
					.setDescription(content)
					.setFooter({ text: strings.embeds.footer });
				const messageContents = { embeds: [embed], ephemeral: true };
				return messageContents;
			},
			rules() {
				const actionRow = functions.builders.actionRows.acceptRules();
				const embed = new EmbedBuilder()
					.setColor(strings.embeds.color)
					.setTitle(strings.embeds.rulesTitle)
					.setDescription(strings.embeds.rules)
					.setFooter({ text: strings.embeds.rulesFooter });
				return { embeds: [embed], components: [actionRow] };
			},
			treeRoleMenu() {
				const actionRow = functions.builders.actionRows.treeRoleMenu();
				const embed = new EmbedBuilder()
					.setColor(strings.embeds.color)
					.setTitle(strings.embeds.roleMenuTitle)
					.setDescription(strings.embeds.treeRoleMenu)
					.setFooter({ text: strings.embeds.roleMenuFooter });
				return { embeds: [embed], components: [actionRow] };
			}
		}
	},
	roles: {
		async fetchRole(guild, roleId) {
			return await guild.roles.fetch(roleId).catch(err => console.error("Error fetching the role: " + err));
		},
		async giveRole(member, role) {
			await member.roles.add(role).catch(err => console.error("Error giving the role: " + err));
		},
		async takeRole(member, role) {
			await member.roles.remove(role).catch(err => console.error("Error taking the role: " + err));
		}
	},
	buttonHandlers: {
		async fruitPing(interaction) {
			const role = await functions.roles.fetchRole(interaction.guild, strings.roleIds.fruitPings);
			if (interaction.member.roles.cache.some(role => role.id == strings.roleIds.fruitPings)) {
				functions.roles.takeRole(interaction.member, role);
			} else {
				functions.roles.giveRole(interaction.member, role);
			}
			await interaction.reply(functions.builders.embeds.info("Roles updated!")).catch(err => console.error(err));
		},
		async waterPing(interaction) {
			const role = await functions.roles.fetchRole(interaction.guild, strings.roleIds.waterPings);
			if (interaction.member.roles.cache.some(role => role.id == strings.roleIds.waterPings)) {
				functions.roles.takeRole(interaction.member, role);
			} else {
				functions.roles.giveRole(interaction.member, role);
			}
			await interaction.reply(functions.builders.embeds.info("Roles updated!")).catch(err => console.error(err));
		},
		async acceptRules(interaction) {
			const role = await functions.roles.fetchRole(interaction.guild, strings.roleIds.member);
			functions.roles.giveRole(interaction.member, role).catch(err => console.error(err));
			await interaction.reply(functions.builders.embeds.info("Roles updated!")).catch(err => console.error(err));
		}
	}
};

module.exports = functions;