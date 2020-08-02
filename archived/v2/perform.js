const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class PerformCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'perform',
			aliases: ['p'],
			group: 'sing',
			memberName: 'perform',
			description: 'Performs a song',
			examples: ['perform [song]'],
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
			const voiceChannel = msg.member.voice.channel;
			if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel');
			if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel');

			if (fs.existsSync(`audio/songs/${text}.wav`)) {
				msg.guild.voiceData.isPlaying = true;
				msg.guild.voiceData.voiceChannel = voiceChannel;
				msg.guild.voiceData.connection = await voiceChannel.join();
				msg.guild.voiceData.dispatcher = msg.guild.voiceData.connection
					.play(`audio/songs/${text}.wav`, { highWaterMark: 64 })
					.on('finish', () => {
						msg.guild.voiceData.isPlaying = false;
					})
					.on('error', error => console.error(error));
				msg.guild.voiceData.dispatcher.setVolumeLogarithmic(msg.guild.voiceData.volume / 5);

				msg.say(`Now performing ${text}`);
				console.log(`Performing ${text}`);
			}
			else {
				msg.say(`No song with that name was found`);
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};