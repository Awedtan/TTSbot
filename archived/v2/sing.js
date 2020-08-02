const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class SingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sing',
			aliases: ['s'],
			group: 'sing',
			memberName: 'sing',
			description: 'Sings a track\n\n' +
				'Format:\n' +
				'sing [n/c] [tempo] length(pitch,pitch)\n' +
				'sing [track]\n\n' +
				'[n/c] stands for notes/chords, only one can be used for a single track\n' +
				'Note length applies to the notes inside the next pair of brackets\n' +
				'No flats, only sharps\n' +
				'Invalid pitches will become rests',
			examples: ['sing [n/c] [tempo] length(pitch,pitch)'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give anything to sing',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			const voiceChannel = msg.member.voice.channel;
			if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel');
			if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel');

			var args = text.split(' ');

			if (args.length == 1 && !args[0].includes('(') && !args[0].includes(')') && !args[0].includes(',')) {
				if (fs.existsSync(`audio/tracks/${text}.txt`)) {
					const path = `audio/tracks/${text}.txt`;
					const content = fs.readFileSync(path, 'utf-8');
					const values = content.split(' ');
					const name = values.shift();

					const writer = new MidiWriter.Writer(this.createTrack(values));
					if (writer != 1) {
						writer.saveMIDI(`audio/song`);

						setTimeout(function () {
							let midiBuffer = fs.readFileSync(`audio/song.mid`);
							let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
							fs.writeFileSync(`audio/song.wav`, wavBuffer, { encoding: 'binary' });
						}, 1000);

						setTimeout(async function () {
							msg.guild.voiceData.isPlaying = true;
							msg.guild.voiceData.voiceChannel = voiceChannel;
							msg.guild.voiceData.connection = await voiceChannel.join();
							msg.guild.voiceData.dispatcher = msg.guild.voiceData.connection
								.play(`audio/song.wav`, { highWaterMark: 64 })
								.on('finish', () => {
									msg.guild.voiceData.isPlaying = false;
								})
								.on('error', error => console.error(error));
							msg.guild.voiceData.dispatcher.setVolumeLogarithmic(msg.guild.voiceData.volume / 5);

							msg.say(`Now singing ${name}`);
							console.log(`Singing ${name}`);
							fs.unlinkSync(`audio/song.mid`);
						}, 2000);
					}
				}
				else {
					msg.say(`No song with that name was found`);
				}
			}
			else {
				var writer = new MidiWriter.Writer(this.createTrack(args));
				if (writer != 1) {
					writer.saveMIDI(`audio/song`);

					setTimeout(function () {
						let midiBuffer = fs.readFileSync(`audio/song.mid`);
						let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
						fs.writeFileSync(`audio/song.wav`, wavBuffer, { encoding: 'binary' });
					}, 1000);

					setTimeout(async function () {
						msg.guild.voiceData.isPlaying = true;
						msg.guild.voiceData.voiceChannel = voiceChannel;
						msg.guild.voiceData.connection = await voiceChannel.join();
						msg.guild.voiceData.dispatcher = msg.guild.voiceData.connection
							.play(`audio/song.wav`, { highWaterMark: 64 })
							.on('finish', () => {
								msg.guild.voiceData.isPlaying = false;
							})
							.on('error', error => console.error(error));
						msg.guild.voiceData.dispatcher.setVolumeLogarithmic(msg.guild.voiceData.volume / 5);

						msg.say(`Now singing a song by ${msg.author.username}`);
						console.log(`Singing a song by ${msg.author.username}`);
						fs.unlinkSync(`audio/song.mid`);
					}, 2000);
				}
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
					tracks[j - 1].setTempo(args[1]);
				}
			}

			for (var i = 2; i < args.length; i++) {
				const values = args[i].split(/[(),]+/);
				for (var j = 1; j < values.length - 1; j++) {
					tracks[j - 1].addEvent(new MidiWriter.NoteEvent({ pitch: [values[j]], duration: values[0] }));
				}
			}
			return tracks;
		}
		else {
			return 1;
		}
	}
};