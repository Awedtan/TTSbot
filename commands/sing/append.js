const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class AppendTrackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'append',
			aliases: ['a'],
			group: 'sing',
			memberName: 'append',
			description: 'Append multiple tracks back-to-back to create a track\n\n' +
				'Tracks must have the same tempo\n' +
				'One track can be used multiple times\n' +
				'A new track will always be created\n' +
				'*Theoretically* there is no limit to the number of tracks\n',
			examples: ['appendtrack [name] [track1] [track2]...'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give anything to append',
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
			const trackNum = args.length - 1;
			var trackString = '', sheetString = '';
			var tempo;
			var constantTempo = true;

			if (trackNum <= 1) {
				return;
			}

			for (let i = 1; i < args.length; i++) {
				if (!fs.existsSync(`audio/tracks/${args[i]}.txt`)) {
					msg.say('❌ Invalid track names');
					return;
				}
			}

			if (fs.existsSync(`audio/tracks/${args[1]}.txt`)) {
				const path = `audio/tracks/${args[1]}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				trackString += content + ' ';
				sheetString += content + '\n';
				tempo = content.split(' ')[2];
			}

			for (let i = 2; i <= trackNum; i++) {
				const path = `audio/tracks/${args[i]}.txt`;
				const content = fs.readFileSync(path, 'utf-8').split(' ');
				sheetString += content.join(' ') + '\n';
				if (content[2] != tempo) {
					constantTempo = false;
				}
				content.shift();
				content.shift();
				content.shift();
				trackString += content.join(' ') + ' ';
			}

			if (constantTempo) {
				fs.writeFileSync(`audio/tracks/${args[0]}.txt`, trackString.trim());
				msg.say(`Appended tracks to create track ${args[0]}`);
			}
			else {
				msg.say(':x: You cannot append two tracks with different tempos')
				// const message = await msg.say('Working...');
				// for (let i = 1; i <= trackNum; i++) {

				// 	const path = `audio/tracks/${args[i]}.txt`;
				// 	const content = fs.readFileSync(path, 'utf-8');
				// 	const values = content.split(' ');
				// 	const name = values.shift();

				// 	const writer = new MidiWriter.Writer(this.client.commands.get('createTrack').run(this.client, values));
				// 	writer.saveMIDI(`audio/temp${i}`);

				// 	await new Promise(resolve => setTimeout(resolve, 500));

				// 	const { exec } = require('child_process');
				// 	exec(`.\\timidity\\timidity.exe .\\audio\\temp${i}.mid -Ow -A400`, (err, stdout, stderr) => {
				// 		if (err) {
				// 			console.log(err);
				// 			return;
				// 		}

				// 		console.log(`stdout: ${stdout}`);
				// 		console.log(`stderr: ${stderr}`);
				// 	});
				// }

				// await new Promise(resolve => setTimeout(resolve, trackNum * 1000));

				// for (let i = 1; i < trackNum; i++) {
				// 	fs.copyFile(`audio/temp${i + 1}.wav`, `audio/copy${i + 1}.wav`, (err) => {
				// 		if (err) {
				// 			throw err;
				// 		}
				// 	});

				// 	ffmpeg(`audio/temp${i}.wav`)
				// 		.input(`audio/copy${i + 1}.wav`)
				// 		.on('error', function (err) { console.log('An error occurred: ' + err.message); })
				// 		.on('end', function () { console.log('Append finished!'); })
				// 		.mergeToFile(`audio/temp${i + 1}.wav`, `songs`);

				// 	await new Promise(resolve => setTimeout(resolve, 1000));
				// 	fs.unlinkSync(`audio/temp${i}.wav`);
				// 	fs.unlinkSync(`audio/copy${i + 1}.wav`);
				// }

				// fs.copyFile(`audio/temp${trackNum}.wav`, `audio/songs/${args[0]}.wav`, (err) => {
				// 	if (err) {
				// 		throw err;
				// 	}
				// });

				// ffmpeg(`audio/songs/${args[0]}.wav`)
				// 	.inputOptions('-t 2')
				// 	.on('error', function (err) { console.log('An error occurred: ' + err.message); })
				// 	.on('end', function () { console.log('Append finished!'); })
				// 	.output(`audio/songs/${args[0]}2.wav`)
				// 	.run();

				// await new Promise(resolve => setTimeout(resolve, 1000));
				// fs.unlinkSync(`audio/temp${trackNum}.wav`);

				// fs.writeFileSync(`audio/sheets/${args[0]}.txt`, sheetString);
				// message.edit(`Appended tracks to create song ${args[0]}`);
			}
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};