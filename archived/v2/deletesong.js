const { Command } = require('discord.js-commando');
const fs = require('fs');

const permission = true;

module.exports = class DeleteSongCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deletesong',
			group: 'sing',
			memberName: 'deletesong',
			description: 'Deletes a song',
			examples: ['deletesong [song]'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what song to delete',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if (permission) {
				if (fs.existsSync(`audio/songs/${text}.wav`)) {
					fs.unlinkSync(`audio/songs/${text}.wav`);
					fs.unlinkSync(`audio/sheets/${text}.txt`);
					msg.say(`\`${text}\` has been deleted`);
					console.log(`${text} has been deleted`);
				}
				else {
					msg.say('That song doesn\'t exist');
					console.log('Delete failed');
				}
			}
			else {
				msg.say(':triumph: You can\'t use that command');
				console.log('Delete failed');
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};