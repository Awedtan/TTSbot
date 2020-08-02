const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
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
				'sing [tempo] [instrument] length(pitch,pitch) length(pitch,pitch)c\n' +
				'sing [track]\n\n' +
				'\'c\' after notes indicates it is to be played as a chord\n' +
				'Once an instrument is set, it will continue to be used afterwards\n' +
				'Instrument will default to piano if none are given\n' +
				'No flats, only sharps\n' +
				'Invalid pitches will become rests',
			examples: ['sing 120 4(e4,d4) 2(c4) flute 4(e4,d4) 2(c4) harp 8(c4,c4,c4,c4) distortedguitar 8(d4,d4,d4,d4) 4(e4,d4) violin 1(c4,e4,g4)c'],
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
			if(!text) return;
			
			const voiceChannel = msg.member.voice.channel;
			if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel');
			if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel');

			var args = text.split(' ');

			if (args.length == 1) {
				if (fs.existsSync(`audio/tracks/${text}.txt`)) {
					const path = `audio/tracks/${text}.txt`;
					const content = fs.readFileSync(path, 'utf-8');
					const values = content.split(' ');
					const name = values.shift();

					const writer = new MidiWriter.Writer(this.client.commands.get('createTrack').run(this.client, values));
					if (writer != 1) {
						writer.saveMIDI(`audio/song`);

						await new Promise(resolve => setTimeout(resolve, 500));

						const { exec } = require('child_process');
						exec(`.\\timidity\\timidity.exe .\\audio\\song.mid -Ow -A400`, (err, stdout, stderr) => {
							if (err) {
								console.log(err);
								return;
							}

							console.log(`stdout: ${stdout}`);
							console.log(`stderr: ${stderr}`);
						});

						await new Promise(resolve => setTimeout(resolve, 500));

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
					}
				}
				else {
					msg.say(`No song with that name was found`);
				}
			}
			else {
				var writer = new MidiWriter.Writer(this.client.commands.get('createTrack').run(this.client, args));
				writer.saveMIDI(`audio/song`);

				await new Promise(resolve => setTimeout(resolve, 500));

				// const instrument = this.client.commands.get('getInstrument').run(args[0]);
				// if (instrument != -1) {

					const { exec } = require('child_process');
					exec(`.\\timidity\\timidity.exe .\\audio\\song.mid -Ow -A400`, (err, stdout, stderr) => {
						if (err) {
							console.log(err);
							return;
						}

						console.log(`stdout: ${stdout}`);
						console.log(`stderr: ${stderr}`);
					});

					await new Promise(resolve => setTimeout(resolve, 1000));

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
				// }
				// else {
				// 	msg.say(`That's not a valid instrument`);
				// }
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};