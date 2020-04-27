const { Command } = require('discord.js-commando');
const owoify = require('owoify-js').default;
const Say = require('say').Say;
const say = new Say('win32');

module.exports = class UwuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uwu',
			aliases: ['owo'],
			group: 'tts',
			memberName: 'uwu',
			description: 'TTSifies some uwuified text',
			examples: ['uwu [text]', 'uwu hello world'],
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
			var punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

			for (var i = 0; i < text.length; i++) {
				if (punctuation.indexOf(text.charAt(i)) != -1) {
					text = text.substring(0, i) + text.substring(i + 1);
				}
			}

			say.export(owoify(text, 'uvu'), `Microsoft ${msg.guild.voiceData.voice} Desktop`, 0.75, `audio/tts.wav`, (err) => {
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
					.play(`audio/tts.wav`)
					.on('finish', () => {
						msg.guild.voiceData.isPlaying = false;
					})
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