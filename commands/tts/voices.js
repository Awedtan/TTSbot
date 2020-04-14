const { Command } = require('discord.js-commando');

module.exports = class VoicesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'voices',
			group: 'tts',
			memberName: 'voices',
			description: `Lists all the bot voices\n` +
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
			examples: ['voices'],
		});
	}

	async run(msg) {
		try {
			msg.say(`\`David\` - American English\n` +
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
			);
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};