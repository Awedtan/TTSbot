const { Command } = require('discord.js-commando');

module.exports = class SampleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sample',
            group: 'sing',
            memberName: 'sample',
            description: 'Listen to an instrument sample',
            examples: ['sample electricguitar'],
            args: [
                {
                    key: 'text',
                    prompt: ':grey_question: You didn\'t give anything to sample',
                    type: 'string',
                    default: ''
                }
            ],
        });
    }

    async run(msg, { text }) {
        try {
            if (!text) return;

            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel');
            if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel');

            const instrument = this.client.commands.get('getInstrument').run(text);

            if (instrument != -1) {
                const { exec } = require('child_process');
                exec(`.\\timidity\\timidity.exe .\\audio\\sample.mid -Ei${instrument} -Ow -A400`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                msg.guild.voiceData.isPlaying = true;
                msg.guild.voiceData.voiceChannel = voiceChannel;
                msg.guild.voiceData.connection = await voiceChannel.join();
                msg.guild.voiceData.dispatcher = msg.guild.voiceData.connection
                    .play(`audio/sample.wav`, { highWaterMark: 64 })
                    .on('finish', () => {
                        msg.guild.voiceData.isPlaying = false;
                    })
                    .on('error', error => console.error(error));
                msg.guild.voiceData.dispatcher.setVolumeLogarithmic(msg.guild.voiceData.volume / 5);

                msg.say(`Now sampling ${text}`);
                console.log(`Sampling ${text}`);
            }
        } catch (err) {
            msg.say('😔 Sorry, something went wrong');
            console.log(err);
        }
    }
};