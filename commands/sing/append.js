const { Command } = require('discord.js-commando');
const audioconcat = require('audioconcat');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = class AppendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'append',
			aliases: ['concat'],
			group: 'sing',
			memberName: 'append',
			description: 'Append two songs together',
			examples: ['append [song] [song] [finalsong]', 'append partone parttwo fullsong'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give any songs to append',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			const args = text.split(" ");

			if (fs.existsSync(`songs/saved/${args[0]}.wav`) && fs.existsSync(`songs/saved/${args[1]}.wav`)) {
				if (args.length == 3) {
					ffmpeg(`songs/saved/${args[0]}.wav`)
						.input(`songs/saved/${args[1]}.wav`)
						.on('error', function (err) {
							console.log('An error occurred: ' + err.message);
						})
						.on('end', function () {
							console.log('Append finished!');
						})
						.mergeToFile(`songs/saved/${args[2]}.wav`, `songs`);
					msg.say(`Appended ${args[0]} and ${args[1]} to create ${args[2]}`);
				}
				else {
					msg.say(':pensive: Sorry, something went wrong');
					console.log('Append failed');
				}
			}
			else {
				msg.say('Those songs don\'t exist');
				console.log('Append failed');
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};