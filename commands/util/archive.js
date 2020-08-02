const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class ArchiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'archive',
			aliases: ['arc'],
			group: 'sing',
			memberName: 'archive',
			description: 'Displays the TTSBot historical archive',
			examples: ['archive'],
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
			
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};