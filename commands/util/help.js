const { prefix } = require("./../../config.json");
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['h'],
			group: 'misc',
			memberName: 'help',
			description: 'Displays the help menu',
			examples: ['help'],
			args: [
				{
					key: 'text',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			if (!text) {
				const embed = new MessageEmbed()
					.setTitle(`Help`)
					.setDescription(
						`Current prefix: \`${prefix}\`\n\n` +
						'TTS\n' +
						'`speak`, `voice\`, `voices`\n\n' +
						'Sing\n' +
						'`sing`, `track`, `instruments`, `sample`, `merge`, `perform`, `append`, `notes`, `sheet`, `displaytrack`, `displaysong`\n\n' +
						'Util\n' +
						'`help`, `leave`\n\n' +
						'Use `help [command]` for more information about a command'
					)
					.addFields(
						{ name: 'What\'s New in V3.0', value: '`append`, `instruments`, `sample`'},
						{ name: 'Removed', value: '`appendtrack`, `appendsong`,' },
						{ name: 'Changed', value: '`sing`, `track`' }
					);
				msg.embed(embed);
			}
			else {
				const commands = this.client.registry.findCommands(text, false, '');
				try {
					var examples = commands[0].examples[0];
					for (let i = 1; i < commands[0].examples.length; i++) {
						examples += '\n' + commands[0].examples[i];
					}

					if (commands[0].aliases.length > 0) {
						var aliases = commands[0].aliases[0];
						for (let i = 1; i < commands[0].aliases.length; i++) {
							aliases += ', ' + commands[0].aliases[i];
						}

						const embed = new MessageEmbed()
							.setTitle('Help')
							.setDescription(commands[0].name)
							.addFields(
								{ name: 'Description', value: commands[0].description, inline: false },
								{ name: 'Examples', value: examples, inline: false },
								{ name: 'Aliases', value: aliases, inline: false },
							);
						msg.embed(embed);
					}
					else {
						const embed = new MessageEmbed()
							.setTitle('Help')
							.setDescription(commands[0].name)
							.addFields(
								{ name: 'Description', value: commands[0].description, inline: false },
								{ name: 'Examples', value: examples, inline: false },
							);
						msg.embed(embed);
					}
				} catch (err) { }
			}
			console.log(`Displayed help menu`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};