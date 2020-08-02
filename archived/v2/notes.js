const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class NotesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'notes',
			aliases: ['note', 'n'],
			group: 'sing',
			memberName: 'notes',
			description: 'Displays the notes in a track',
			examples: ['notes [track]'],
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
			if (fs.existsSync(`audio/tracks/${text}.txt`)) {
				const path = `audio/tracks/${text}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				if (content.length < 2000) {
					msg.say(content);
				}
				else {
					msg.channel.send({ files: [`audio/notes/${text}.txt`] });
				}

				console.log(`Displayed ${text}'s notes`);
			}
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};