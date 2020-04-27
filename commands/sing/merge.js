const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class MergeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'merge',
			aliases: ['mush', 'squash'],
			group: 'sing',
			memberName: 'merge',
			description: 'Merges two songs together in parallel',
			examples: ['merge [song] [song] [finalsong]', 'merge hotcrossbuns hotcrossbunsbassline hotcrossbunsfull'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give any songs to merge',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};