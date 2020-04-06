const { prefix, token } = require("./config.json");
const config = require("./config.json");
const fs = require("fs");
const Discord = require("discord.js");
const Client = require('./Client');
const client = new Client();
const Say = require('say').Say;
const say = new Say('win32');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(client.commands);

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
	if (message.author.bot) return;

	if (message.content.startsWith(`${prefix}`)) {
		console.log();
		console.log(`Received from ${message.author.username} in ${message.channel.name}: ${message.content}`);

		const args = message.content.split(" ");
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName);

		try {
			command.execute(message, client);
		} catch (error) {
			console.log("Command failure");
			return message.channel.send(
				":grey_question: Did you type that correctly?"
			);
		}
	}
	else {

	}
});

client.login(token);