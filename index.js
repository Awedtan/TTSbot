const { prefix, token, ownerid } = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const { Structures, Collection } = require('discord.js');
const Say = require('say').Say;
const say = new Say('win32');
const path = require('path');
const fs = require('fs');

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

client.commands = new Collection();
const singCommands = fs.readdirSync('./commands/sing').filter(file => file.endsWith('.js'));
const ttsCommands = fs.readdirSync('./commands/tts').filter(file => file.endsWith('.js'));
const utilCommands = fs.readdirSync('./commands/util').filter(file => file.endsWith('.js'));

for (const file of singCommands) {
	const command = require(`./commands/sing/${file}`);
	client.commands.set(command.name, command);
}
for (const file of ttsCommands) {
	const command = require(`./commands/tts/${file}`);
	client.commands.set(command.name, command);
}
for (const file of utilCommands) {
	const command = require(`./commands/util/${file}`);
	client.commands.set(command.name, command);
}

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
	client.user.setActivity('version 3.0 is now in beta');
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

/*

todo:
appendsong
appendtrack
deletesong
deletetrack
displaysong
merge
perform
save
sheet
instruments(new)

done:
displaytrack
notes
sing
track

use await new Promise(resolve => setTimeout(resolve, 1000)); for timed delays

notes/chords -> tracks -> midi -> wav

notes/chords are user input via discord messages
tracks are literally just user input in a text file
midis are tracks that have been turned into a midi file using midi-writer
wavs are midis that have had soundfonts applied using TiMidity and turned to wav files

sing tempo duration(note,note)note/chord

to play midi files: timidity -Eb${b} -Ei${n} -Ow song.mid
b is bank number
n is instrument program number

*/