// const { Command } = require('discord.js-commando');
// const { Midi } = require("@tonaljs/tonal");
// const midiFile = require('midi-file');
// const fs = require('fs');

// module.exports = class FileCommand extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'file',
// 			group: 'sing',
// 			memberName: 'file',
// 			description: 'Converts a midi file into TTS Bot notation',
// 			examples: ['file'],
// 		});
// 	}

// 	async run(msg) {
// 		try {
// 			var something = '';
// 			const input = fs.readFileSync('audio/72257.mid');
// 			const parsed = midiFile.parseMidi(input);
// 			const numTracks = parsed.header.numTracks;
// 			const tracks = parsed.tracks;

// 			console.log(parsed);

// 			for (let i = 0; i < numTracks; i++) {
// 				const tempo = 60 * (1000000 / tracks[i][0].microsecondsPerBeat);
// 				var notationString = `${tempo} `;

// 				console.log(tracks[i]);

// 				for (let j = 1; j < tracks[i].length; j++) {
// 					const event = tracks[i][j];

// 					if (event.type === 'noteOn') {

// 						var duration, increment = 1;
// 						try {
// 							do {
// 								console.log(j);
// 								console.log(increment);
// 								duration = Math.floor(516 / tracks[i][j + increment].deltaTime);
// 								if (tracks[i][j + increment].noteNumber != event.noteNumber) duration = Infinity;
// 								increment++;
// 							} while (duration == Infinity);
// 						} catch (err) { }

// 						const noteValue = Midi.midiToNoteName(event.noteNumber, { sharps: true });
// 						notationString += `${duration}(${noteValue}) `;
// 					}
// 					else if (event.type === 'noteOff') {
// 						continue;
// 					}
// 					else if (event.type === 'programChange') {
// 						const instrument = this.client.commands.get('getProgramNumber').run(event.programNumber);

// 						notationString += `${instrument} `;
// 					}
// 					else if (event.type === 'endOfTrack') {
// 						continue;
// 					}
// 					else {
// 						// msg.say(`😔 An unexpected midi event occured: ${event.type}`);
// 						// return;
// 					}
// 				}
// 				something += notationString;
				
// 			}
// 			fs.writeFileSync(`audio/filetest.txt`, something);
// 			msg.channel.send({ files: [`audio/filetest.txt`] });
// 		} catch (err) {
// 			msg.say(err);
// 			console.log(err);
// 		}
// 	}
// };