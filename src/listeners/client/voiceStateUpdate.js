const { Listener } = require('@sapphire/framework');
const { VoiceState } = require('discord.js');
const delay = require('delay');

class VoiceStateUpdateEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	/**
	 *
	 * @param {VoiceState} oldState
	 * @param {VoiceState} newState
	 */
	async run(oldState, newState) {
		const { client } = this.container;
		await delay(1000);
		// get guild and player
		let guildId = newState.guild.id;
		const player = client.manager.get(guildId);
		// check if the bot is active (playing, paused or empty does not matter (return otherwise)
		if (!player || player.state !== 'CONNECTED') return;

		// prepreoces the data
		const stateChange = {};
		// get the state change
		if (oldState.channel === null && newState.channel !== null) stateChange.type = 'JOIN';
		if (oldState.channel !== null && newState.channel === null) stateChange.type = 'LEAVE';
		if (oldState.channel !== null && newState.channel !== null) stateChange.type = 'MOVE';
		if (oldState.channel === null && newState.channel === null) return; // you never know, right
		if (newState.serverMute == true && oldState.serverMute == false)
			if (newState.serverMute == false && oldState.serverMute == true)
				if (stateChange.type === 'MOVE') {
					// return player.pause(true);
					// move check first as it changes type
					if (oldState.channel.id === player.voiceChannel) stateChange.type = 'LEAVE';
					if (newState.channel.id === player.voiceChannel) stateChange.type = 'JOIN';
				}
		// double triggered on purpose for MOVE events
		if (stateChange.type === 'JOIN') stateChange.channel = newState.channel;
		if (stateChange.type === 'LEAVE') stateChange.channel = oldState.channel;
		// check if the bot's voice channel is involved (return otherwise)
		if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel) return;
		// filter current users based on being a bot
		stateChange.members = stateChange.channel.members.filter((member) => !member.user.bot);
		// switch (stateChange.type) {
		//   case "JOIN":
		//     if (stateChange.members.size === 1 && player.paused) {
		//       player.pause(false);
		//     }
		//     break;
		//   case "LEAVE":
		//     if (
		//       stateChange.members.size === 0 &&
		//       !player.paused &&
		//       player.playing
		//     ) {
		//       player.pause(true);
		//     }
		//     break;
		// }
	}
}

exports.VoiceStateUpdateEvent = VoiceStateUpdateEvent;
