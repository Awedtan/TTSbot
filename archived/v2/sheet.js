const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class SheetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sheet',
			group: 'sing',
			memberName: 'sheet',
			description: 'Displays the tracks in a song',
			examples: ['sheet [song]'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give anything to save',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if (fs.existsSync(`audio/sheets/${text}.txt`)) {
				const path = `audio/sheets/${text}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				if (content.length < 2000) {
					msg.say(content);
				}
				else {
					msg.channel.send({ files: [`audio/sheets/${text}.txt`] });
				}

				console.log(`Displayed ${text}'s sheet`);
			}
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};