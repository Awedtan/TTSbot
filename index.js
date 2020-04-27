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
				volume: 2
			};

			this.commands = new Collection();

			const singCommands = fs.readdirSync('./commands/sing').filter(file => file.endsWith('.js'));
			const ttsCommands = fs.readdirSync('./commands/tts').filter(file => file.endsWith('.js'));
			const miscCommands = fs.readdirSync('./commands/misc').filter(file => file.endsWith('.js'));

			for (const file of singCommands) {
				const command = require(`./commands/sing/${file}`);
				this.commands.set(command.name, command);
			}
			for (const file of ttsCommands) {
				const command = require(`./commands/tts/${file}`);
				this.commands.set(command.name, command);
			}
			for (const file of miscCommands) {
				const command = require(`./commands/misc/${file}`);
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