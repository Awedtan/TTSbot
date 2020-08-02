const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['disconnect', 'dc'],
			group: 'tts',
			memberName: 'leave',
			description: 'Leaves the current voice channel',
			examples: ['leave'],
		});
	}

	async run(msg) {
		try {
			if (msg.guild.voiceData.voiceChannel) {
				msg.say(`:door: Left ${msg.guild.voiceData.voiceChannel.name}`);
				console.log(`Left ${msg.guild.voiceData.voiceChannel.name}`);

				msg.guild.voiceData.voiceChannel.leave();
				msg.guild.voiceData.isPlaying = false;
				msg.guild.voiceData.connection = null;
				msg.guild.voiceData.dispatcher = null;
				msg.guild.voiceData.message = null;
				msg.guild.voiceData.voiceChannel = null;
				msg.guild.voiceData.queue = [];
			}
			else {
				msg.say(':x: I\'m not in a voice channel');
				console.log('Leave failed (not in channel)');
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};