const { Command } = require('discord.js-commando');
const Say = require('say').Say;
const say = new Say('win32');

module.exports = class SpeakCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'speak',
			aliases: ['say'],
			group: 'tts',
			memberName: 'play',
			description: 'TTSifies some text',
			examples: ['speak hello world'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what to speak',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel.');
		if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel.');

		try {
			var query = text;
			say.export(text, `Microsoft ${msg.guild.voiceData.voice} Desktop`, 0.75, `audio/${text}.wav`, (err) => {
				if (err) {
					console.log(err);
					return;
				}
			});

			setTimeout(async function () {
				msg.guild.voiceData.message = msg;
				msg.guild.voiceData.queue.push();
				msg.guild.voiceData.connection = await voiceChannel.join();
				msg.guild.voiceData.voiceChannel = voiceChannel;

				msg.guild.voiceData.dispatcher = msg.guild.voiceData.connection
					.play(`audio/${text}.wav`)
					.on('error', error => console.error(error));
				msg.guild.voiceData.dispatcher.setVolumeLogarithmic(msg.guild.voiceData.volume / 5);
				
				console.log(`Speaking ${text}`);
			}, 4000);
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};