const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const ffmpeg = require('fluent-ffmpeg');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class AppendSongCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'appendsong',
			aliases: ['as'],
			group: 'sing',
			memberName: 'appendsong',
			description: 'Append multiple songs back-to-back\n\n' +
				'Songs will be put in the specified order\n' +
				'One song can be used multiple times\n' +
				'*Theoretically* there is no limit to the number of songs\n' +
				'A new song will always be created\n',
			examples: ['appendsong [name] [song1] [song2]...'],
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
			const trackNum = args.length - 1;
			var sheetString = '';

			const message = await msg.say('Working...');

			for (let i = 1; i <= trackNum; i++) {
				const path = `audio/sheets/${args[i]}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				sheetString += content + '\n';

				fs.copyFile(`audio/songs/${args[i]}.wav`, `audio/songs/temp${i}.wav`, (err) => {
					if (err) {
						throw err;
					}
				});
			}

			await new Promise(resolve => setTimeout(resolve, 1000));

			for (let i = 1; i < trackNum; i++) {
				fs.copyFile(`audio/songs/temp${i + 1}.wav`, `audio/songs/copy${i + 1}.wav`, (err) => {
					if (err) {
						throw err;
					}
				});

				ffmpeg(`audio/songs/temp${i}.wav`)
					.input(`audio/songs/copy${i + 1}.wav`)
					.on('error', function (err) {
						console.log('An error occurred: ' + err.message);
					})
					.on('end', function () {
						console.log('Append finished!');
					})
					.mergeToFile(`audio/songs/temp${i + 1}.wav`, `songs`);

				await new Promise(resolve => setTimeout(resolve, 1000));
				fs.unlinkSync(`audio/songs/temp${i}.wav`);
				fs.unlinkSync(`audio/songs/copy${i + 1}.wav`);
			}

			fs.renameSync(`audio/songs/temp${trackNum}.wav`, `audio/songs/${args[0]}.wav`, (err) => {
				if (err) {
					throw err;
				}
			});

			await new Promise(resolve => setTimeout(resolve, 1000));

			fs.writeFileSync(`audio/sheets/${args[0]}.txt`, sheetString);
			message.edit(`Appended songs to create song ${args[0]}`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};