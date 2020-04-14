const { prefix, token, ownerid } = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const { Structures, Collection } = require('discord.js');
const Say = require('say').Say;
const say = new Say('win32');
const path = require('path');
const fs = require("fs");

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
				volume: 5
			};

			this.commands = new Collection();

			const commandCollection = fs.readdirSync('./commands/tts').filter(file => file.endsWith('.js'));

			for (const file of commandCollection) {
				const command = require(`./commands/tts/${file}`);
				this.commands.set(command.name, command);
			}

			console.log(this.client.registry.findCommands(''.command, false, ''));
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
		['tts', 'TTS']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({ help: false })
	.registerCommandsIn(path.join(__dirname, 'commands'))
	;

client.once("ready", () => {
	say.getInstalledVoices((err, voices) => console.log(voices));
	console.log("Ready!");
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