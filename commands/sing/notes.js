const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class NotesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'notes',
			aliases: ['note', 'sheet'],
			group: 'sing',
			memberName: 'notes',
			description: 'Displays the notes for a song',
			examples: ['notes [song]', 'notes hotcrossbuns'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what song you wanted',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if (fs.existsSync(`songs/saved/notes/${text}.txt`)) {
				const path = `songs/saved/notes/${text}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				msg.say(content);

				console.log(`Displayed ${text}'s notes`);
			}
			else {
				msg.say('The notes for that song don\'t exist');
				console.log('Notes failed');
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};