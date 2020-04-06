const { prefix } = require("./../config.json");

module.exports = {
	name: `${prefix}voice`,
	description:
		`\`voice [name]\`: changes the voice of the speak command\n` +
		`\`David\` - American English\n` +
		`\`Zira\` - American English\n` +
		`\`Hazel\` - British English\n` +
		`\`Huihui\` - Chinese (Simplified)\n` +
		`\`Hanhan\` - Chinese (Traditional)\n` +
		`\`Hortense\` - French\n` +
		`\`Hedda\` - German\n` +
		`\`Elsa\` - Italian\n` +
		`\`Haruka\` - Japanese\n` +
		`\`Heami\` - Korean\n` +
		`\`Paulina\` - Polish\n` +
		`\`Maria\` - Portuguese\n` +
		`\`Irina\` - Russian\n` +
		`\`Helena\` - Spanish\n`
	,

	execute(message, client) {
		try {
			const args = message.content.split(" ");
			if (args.length == 2) {
				const voices = ["david", "zira", "hazel", "huihui", "hanhan", "hortense", "hedda", "elsa", "haruka", "heami", "paulina", "maria", "irina", "helena"]
				if (voices.includes(args[1].toLowerCase())) {
					client.speech = args[1].toUpperCase().charAt(0) + args[1].substring(1);
					console.log(`Changed tts voice to ${client.speech}`);
					return message.channel.send(
						`:+1: Changed tts voice to ${client.speech}`
					);
				}
				else {
					console.log(`Voice failure (invalid voice)`);
					return message.channel.send(
						`:x: That's not a valid voice`
					);
				}
			}
			else if (args.length == 1) {
				console.log(`Current voice: ${client.speech}`);
				return message.channel.send(
					`${client.speech} is currently speaking`
				);
			}
		} catch (err) {
			console.log("Voice failure");
			return message.channel.send(
				":pensive: Sorry, something went wrong"
			);
		}
	}
};