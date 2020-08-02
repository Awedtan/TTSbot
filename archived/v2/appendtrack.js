const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const ffmpeg = require('fluent-ffmpeg');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class AppendTrackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'appendtrack',
			aliases: ['at'],
			group: 'sing',
			memberName: 'appendtrack',
			description: 'Append multiple tracks back-to-back\n\n' +
				'Tracks will be put in the specified order\n' +
				'One track can be used multiple times\n' +
				'*Theoretically* there is no limit to the number of tracks\n' +
				'Tracks with shared tempos and note/chord modes will create a new track\n' +
				'Tracks with differing tempos or a mixture of notes and chords will create a song\n',
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
				fs.writeFileSync(`audio/tracks/${args[0]}.txt`, trackString);
				msg.say(`Appended tracks to create track ${args[0]}`);
			}
			else {
				const message = await msg.say('Working...');
				for (let i = 1; i <= trackNum; i++) {

					const path = `audio/tracks/${args[i]}.txt`;
					const content = fs.readFileSync(path, 'utf-8');
					const values = content.split(' ');
					const name = values.shift();

					const writer = new MidiWriter.Writer(this.createTrack(values));
					writer.saveMIDI(`audio/temp${i}`);

					setTimeout(function () {
						let midiBuffer = fs.readFileSync(`audio/temp${i}.mid`);
						let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
						fs.writeFileSync(`audio/temp${i}.wav`, wavBuffer, { encoding: 'binary' });
						fs.unlinkSync(`audio/temp${i}.mid`);
					}, 1000);
				}

				await new Promise(resolve => setTimeout(resolve, trackNum * 1000));

				for (let i = 1; i < trackNum; i++) {
					fs.copyFile(`audio/temp${i + 1}.wav`, `audio/copy${i + 1}.wav`, (err) => {
						if (err) {
							throw err;
						}
					});

					ffmpeg(`audio/temp${i}.wav`)
						.input(`audio/copy${i + 1}.wav`)
						.on('error', function (err) {
							console.log('An error occurred: ' + err.message);
						})
						.on('end', function () {
							console.log('Append finished!');
						})
						.mergeToFile(`audio/temp${i + 1}.wav`, `songs`);

					await new Promise(resolve => setTimeout(resolve, 1000));
					fs.unlinkSync(`audio/temp${i}.wav`);
					fs.unlinkSync(`audio/copy${i + 1}.wav`);
				}

				fs.copyFile(`audio/temp${trackNum}.wav`, `audio/songs/${args[0]}.wav`, (err) => {
					if (err) {
						throw err;
					}
				});

				await new Promise(resolve => setTimeout(resolve, 1000));
				fs.unlinkSync(`audio/temp${trackNum}.wav`);

				fs.writeFileSync(`audio/sheets/${args[0]}.txt`, sheetString);
				message.edit(`Appended tracks to create song ${args[0]}`);
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}

	createTrack(args) {
		if (args[0] === 'n') {
			var track = new MidiWriter.Track();
			track.setTempo(args[1]);

			for (var i = 2; i < args.length; i++) {
				const values = args[i].split(/[(),]+/);
				for (var j = 1; j < values.length - 1; j++) {
					track.addEvent(new MidiWriter.NoteEvent({ pitch: [values[j]], duration: values[0] }));
				}
			}
			return track;
		}
		else if (args[0] === 'c') {
			var tracks = [];

			for (var i = 2; i < args.length; i++) {
				const values = args[i].split(/[(),]+/);
				for (var j = 1; j < values.length - 1; j++) {
					tracks[j - 1] = new MidiWriter.Track();
				}
			}

			for (var i = 2; i < args.length; i++) {
				const values = args[i].split(/[(),]+/);
				for (var j = 1; j < values.length - 1; j++) {
					tracks[j - 1].addEvent(new MidiWriter.NoteEvent({ pitch: [values[j]], duration: values[0] }));
				}
			}

			for (let i = 1; i < tracks.length; i++) {
				tracks[0].mergeTrack(tracks[i]);
			}

			return tracks[0];
		}
		else {
			return 1;
		}
	}
};