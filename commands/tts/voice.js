const { Command } = require('discord.js-commando');

module.exports = class VoiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'voice',
			group: 'tts',
			memberName: 'voice',
			description: `Changes the voice of the bot\n` +
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
				`\`Helena\` - Spanish\n`,
			examples: ['voice hazel', 'voice hortense'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what voice to change to',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if (!text) {
				console.log(`Current voice: ${msg.guild.voiceData.voice}`);
				return msg.say(`${msg.guild.voiceData.voice} is currently speaking`);
			}

			const args = text.split(" ");

			if (args.length == 1) {
				const voices = ["david", "zira", "hazel", "huihui", "hanhan", "hortense", "hedda", "elsa", "haruka", "heami", "paulina", "maria", "irina", "helena"];

				if (voices.includes(args[0].toLowerCase())) {
					msg.guild.voiceData.voice = args[0].toUpperCase().charAt(0) + args[0].substring(1);
					console.log(`Changed tts voice to ${msg.guild.voiceData.voice}`);
					return msg.say(`:+1: Changed tts voice to ${msg.guild.voiceData.voice}`);
				}
				else {
					console.log(`Voice failure (invalid voice)`);
					return msg.say(`:x: That's not a valid voice`);
				}
			}
			else {
				console.log(`Voice failure (invalid voice)`);
				return msg.say(`:x: That's not a valid voice`);
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};