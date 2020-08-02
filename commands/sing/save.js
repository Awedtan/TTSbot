const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class SaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'save',
			group: 'sing',
			memberName: 'save',
			description: 'Saves a track as a song',
			examples: ['save [name] [track]'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give anything to save',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			if(!text) return;
			
			var args = text.split(' ');
			var track;

			if (fs.existsSync(`audio/tracks/${args[0]}.txt`)) {
				const path = `audio/tracks/${args[0]}.txt`;
				const content = fs.readFileSync(path, 'utf-8');
				const values = content.split(' ');
				values.shift();

				track = this.client.commands.get('createTrack').run(this.client, values);
				fs.writeFileSync(`audio/sheets/${args[0]}.txt`, content);
			}
			else {
				msg.say('❌ Invalid track name');
				return;
			}

			const writer = new MidiWriter.Writer(track);
			writer.saveMIDI(`audio/songs/${args[0]}`);

			await new Promise(resolve => setTimeout(resolve, 500));

			const { exec } = require('child_process');
			exec(`.\\timidity\\timidity.exe .\\audio\\songs\\${args[0]}.mid -Ow -A400`, (err, stdout, stderr) => {
				if (err) {
					console.log(err);
					return;
				}

				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});

			await new Promise(resolve => setTimeout(resolve, 500));

			msg.say(`Saved track as song \`${args[0]}\``);
			console.log(`Saved track as song \`${args[0]}\``);
			// fs.unlinkSync(`audio/songs/${args[0]}.mid`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};