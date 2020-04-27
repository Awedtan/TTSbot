const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class DeleteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete',
			group: 'sing',
			memberName: 'delete',
			description: 'Deletes a saved song',
			examples: ['delete [song]', 'delete hotcrossbuns'],
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
			if (this.client.isOwner(msg.author)) {
				if (fs.existsSync(`songs/saved/${text}.wav`)) {
					fs.unlinkSync(`songs/saved/${text}.wav`);
					msg.say(`${text} has been deleted`);
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
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};