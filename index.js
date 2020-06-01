const { prefix, token, ownerid } = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const Say = require('say').Say;
const say = new Say('win32');
const path = require('path');

Structures.extend('Guild', Guild => {
	class TTSGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.voiceData = {
				isPlaying: false,
				connection: null,
				dispatcher: null,
				message: null,
				voiceChannel: null,
				queue: [],
				voice: 'David',
				volume: 2
			};
		}
	}
	return TTSGuild;
});

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ownerid,
	disableEveryone: true,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['tts', 'TTS'],
		['sing', 'Sing'],
		['misc', 'Misc']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({ help: false })
	.registerCommandsIn(path.join(__dirname, 'commands'))
	;

client.once("ready", () => {
	say.getInstalledVoices((err, voices) => console.log(voices));
	console.log("Ready!");
	client.user.setActivity('Now on discord.js commando!');
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnected!");
});

client.on("message", async message => {
});

client.login(token);