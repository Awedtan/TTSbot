const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class DisplayTrackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'displaytrack',
			aliases: ['displaytracks', 'dt'],
			group: 'sing',
			memberName: 'displaytrack',
			description: 'Shows the list of saved tracks',
			examples: ['displaytrack'],
		});
	}

	async run(msg) {
		try {
			const files = fs.readdirSync('audio/tracks').filter(file => file.endsWith('.txt'));
			var tracks = [];

			for (const file of files) {
				tracks.push(file);
			}

			const embed = new MessageEmbed()
				.addFields(
					{ name: 'Tracks', value: tracks, inline: false }
				);
			msg.embed(embed);
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};