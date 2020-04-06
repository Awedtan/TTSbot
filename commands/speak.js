const { prefix } = require("./../config.json");
const Say = require('say').Say;
const say = new Say('win32');

module.exports = {
	name: `${prefix}speak`,
	description: `\`speak [text]\`: text-to-speechifies the text`,

	async execute(message, client) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.channel.send(
				"You need to be in a voice channel to use that"
			);
		}
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			return message.channel.send(
				"I need permission to join and speak in your voice channel"
			);
		}

		try {
			args = message.content.toLowerCase().split(" ");
			var query = args[1];
			for (let i = 2; i < args.length; i++) {
				query += " " + args[i];
			}

			say.export(query, `Microsoft ${client.speech} Desktop`, 0.75, `audio/tts.wav`, (err) => {
				if (err) {
					console.log(err);
					return;
				}
			});

			setTimeout(function () {
				message.member.voice.channel.join()
					.then(connection => {
						connection.play(`audio/tts.wav`);;
					});
				console.log(`Speaking ${query}`);
			}, 1000);
		} catch (err) {
			console.log(err);
			console.log("Speak failure");
		}
	}
};