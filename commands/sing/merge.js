const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class MergeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'merge',
			aliases: ['m'],
			group: 'sing',
			memberName: 'merge',
			description: 'Merge multiple tracks in parallel to create a song\n\n' +
				'It is *HIGHLY* recommended to **append** tracks first before merging into songs\n' +
				'One track can be used multiple times\n' +
				'A new song will always be created\n' +
				'*Theoretically* there is no limit to the number of tracks',
			examples: ['merge [name] [track1] [track2]...'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give anything to merge',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if(!text) return;
			
			var args = text.split(' ');
			var tracks = [];
			var sheetString = '';

			const message = await msg.say('Working...');

			for (let i = 1; i < args.length; i++) {
				if (fs.existsSync(`audio/tracks/${args[i]}.txt`)) {
					const path = `audio/tracks/${args[i]}.txt`;
					const content = fs.readFileSync(path, 'utf-8');
					const values = content.split(' ');
					values.shift();

					tracks[i - 1] = this.client.commands.get('createTrack').run(this.client, values);
					sheetString += content + '\n';
				}
				else {
					msg.say('❌ Invalid track names');
					return;
				}
			}

			fs.writeFileSync(`audio/sheets/${args[0]}.txt`, sheetString);

			const writer = new MidiWriter.Writer(tracks);
			writer.saveMIDI(`audio/songs/${args[0]}`);

			await new Promise(resolve => setTimeout(resolve, 500));

			let midiBuffer = fs.readFileSync(`audio/songs/${args[0]}.mid`);
			let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
			fs.writeFileSync(`audio/songs/${args[0]}.wav`, wavBuffer, { encoding: 'binary' });

			await new Promise(resolve => setTimeout(resolve, 500));

			message.edit(`Merged tracks into song \`${args[0]}\``);
			console.log(`Merged tracks into song \`${args[0]}\``);
			// fs.unlinkSync(`audio/songs/${args[0]}.mid`);
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
					tracks[j - 1].setTempo(args[1]);
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