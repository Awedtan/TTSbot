const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class DisplaySongCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'displaysong',
			aliases: ['displaysongs', 'ds'],
			group: 'sing',
			memberName: 'displaysong',
			description: 'Shows the list of saved songs',
			examples: ['displaysong'],
		});
	}

	async run(msg) {
		try {
			const files = fs.readdirSync('audio/songs').filter(file => file.endsWith('.wav'));
			var songs = [];

			for (const file of files) {
				songs.push(file);
			}

			const embed = new MessageEmbed()
				.addFields(
					{ name: 'Songs', value: songs, inline: false }
				);
			msg.embed(embed);
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};