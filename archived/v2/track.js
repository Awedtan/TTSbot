const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class TrackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'track',
			aliases: ['t'],
			group: 'sing',
			memberName: 'track',
			description: 'Saves a track\n\n' +
				'Format:\n' +
				'track [name] [n/c] [tempo] length(pitch,pitch)\n\n' +
				'[n/c] stands for notes/chords, only one can be used for a single track\n' +
				'Note length applies to the notes inside the next pair of brackets\n' +
				'No flats, only sharps\n' +
				'Invalid pitches will become rests',
			examples: ['track [name] [n/c] [tempo] length(pitch,pitch)'],
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
			const args = text.split(" ");
			fs.writeFileSync(`audio/tracks/${args[0]}.txt`, text);
			msg.say(`Created track \`${args[0]}\``);
			console.log(`Created track \`${args[0]}\``);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};