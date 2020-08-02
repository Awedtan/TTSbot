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
				'track [name] [tempo] [instrument] length(pitch,pitch) length(pitch,pitch)c\n' +
				'\'c\' after notes indicates it is to be played as a chord\n' +
				'Once an instrument is set, it will continue to be used afterwards\n' +
				'Instrument will default to piano if none are given\n' +
				'No flats, only sharps\n' +
				'Invalid pitches will become rests',
			examples: ['track hcbremix 120 4(e4,d4) 2(c4) flute 4(e4,d4) 2(c4) harp 8(c4,c4,c4,c4) distortedguitar 8(d4,d4,d4,d4) 4(e4,d4) violin 1(c4,e4,g4)c'],
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
			if(!text) return;
			
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