const { prefix } = require("./../config.json");
const Discord = require("discord.js");

module.exports = {
	name: `${prefix}help`,
	description: ``,

	execute(message, client) {
		try {
			const args = message.content.split(" ");
			if (args.length <= 1) {
				embed = new Discord.MessageEmbed()
					.setTitle(`Help Menu`)
					.setDescription(
						`Current prefix: \`${prefix}\`\n\n` +
						`TTS\n` +
						`\`speak\`, \`voice\`\n\n` +
						`Use \`help [command]\` for more information about a command`
					)
				return message.channel.send(embed);
			}
			else if (args.length == 2) {
				const commandName = `${prefix}` + args[1].toLowerCase();
				const command = client.commands.get(commandName);
				return message.channel.send(command.description);
			}
		} catch {
			console.log("Help failed");
			return message.channel.send(
				":grey_question: Did you type that correctly?"
			);
		}
	}
};