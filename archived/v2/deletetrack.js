const { Command } = require('discord.js-commando');
const fs = require('fs');

const permission = true;

module.exports = class DeleteTrackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deletetrack',
			group: 'sing',
			memberName: 'deletetrack',
			description: 'Deletes a track',
			examples: ['deletetrack [track]'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what track to delete',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if (permission) {
				if (fs.existsSync(`audio/tracks/${text}.txt`)) {
					fs.unlinkSync(`audio/tracks/${text}.txt`);
					msg.say(`\`${text}\` has been deleted`);
					console.log(`${text} has been deleted`);
				}
				else {
					msg.say('That track doesn\'t exist');
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