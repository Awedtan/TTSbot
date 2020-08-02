const MidiWriter = require('midi-writer-js');

module.exports = {
	name: `createTrack`,
	description: 'Something',

	run(client, args) {
		try {
			var track = new MidiWriter.Track();
			const tempo = parseInt(args[1]);
			var instrument = client.commands.get('getInstrument').run(args[0])

			if (instrument != -1) {
				track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument }));
				track.setTempo(tempo);
				const split = args.slice(2);

				for (let i = 0; i < split.length; i++) {
					instrument = client.commands.get('getInstrument').run(split[i])
					if (instrument != -1) {
						track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument }));
					}
					else {
						const values = split[i].split(/[(),]+/);
						const notes = values.slice(1, values.length - 1);
						var sequential = true;

						if (values[values.length - 1] == 'c') sequential = false;
						track.addEvent(new MidiWriter.NoteEvent({ pitch: notes, duration: values[0], sequential: sequential }));
					}
				}
			}
			else {
				track.setTempo(args[0]);
				const split = args.slice(1);

				for (let i = 0; i < split.length; i++) {
					instrument = client.commands.get('getInstrument').run(split[i])
					if (instrument != -1) {
						track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument }));
					}
					else {
						const values = split[i].split(/[(),]+/);
						const notes = values.slice(1, values.length - 1);
						var sequential = true;

						if (values[values.length - 1] == 'c') sequential = false;
						track.addEvent(new MidiWriter.NoteEvent({ pitch: notes, duration: values[0], sequential: sequential }));
					}
				}
			}
			return track;
		} catch (err) {
			console.log(err);
		}
	}
};