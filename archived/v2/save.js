const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class SaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'save',
			group: 'sing',
			memberName: 'save',
			description: 'Saves a track as a song',
			examples: ['save [name] [track]'],
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
			var args = text.split(' ');
			var track;

			if (fs.existsSync(`audio/tracks/${args[0]}.txt`)) {
				const path = `audio/tracks/${args[0]}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				const values = content.split(' ');
				values.shift();

				track = this.createTrack(values);
				fs.writeFileSync(`audio/sheets/${args[0]}.txt`, content);
			}
			else {
				msg.say('❌ Invalid track name');
				return;
			}

			const writer = new MidiWriter.Writer(track);
			writer.saveMIDI(`audio/songs/${args[0]}`);

			setTimeout(function () {
				let midiBuffer = fs.readFileSync(`audio/songs/${args[0]}.mid`);
				let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
				fs.writeFileSync(`audio/songs/${args[0]}.wav`, wavBuffer, { encoding: 'binary' });
			}, 1000);

			setTimeout(async function () {
				msg.say(`Saved track as song \`${args[0]}\``);
				console.log(`Saved track as song \`${args[0]}\``);
				fs.unlinkSync(`audio/songs/${args[0]}.mid`);
			}, 2000);
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