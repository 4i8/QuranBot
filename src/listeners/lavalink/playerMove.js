const { Listener, container } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const { resolveKey } = require('../../lib/structures/exports');
class PlayerMoveEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'playerMove'
		});
	}

	/**
	 *
	 * @param {import('erela.js').Player} player
	 * @param {string} oldChannel
	 * @param {string} newChannel
	 * @returns
	 */
	async run(player, oldChannel, newChannel) {
		const { client } = this.container;
		const guild = client.guilds.cache.get(player.guild);
		if (!guild) return;
		const channel = guild.channels.cache.get(player.textChannel);
		if (oldChannel === newChannel) return;
		if (newChannel === null || !newChannel) {
			if (!player) return;
			try {
				player.MessagePlayer.delete().catch(() => {});
				player.MessagePlayercollector.stop();
			} catch {}
			if (channel)
				await channel
					.send({
						embeds: [
							new MessageEmbed()
								.setDescription(
									await resolveKey({ guild: guild }, 'events:player_move_stoped', {
										replace: {
											emoji: client.config.emojis.wave,
											channel: `<#${oldChannel}>`
										}
									})
								)
								.setColor(client.config.colors.Error)
						]
					})
					.catch(() => {});
			// player.state = 'DESTROYING';
			delete process.cache.await[player.guild];
			return player.destroy();
		} else {
			player.voiceChannel = newChannel;
			if (channel) {
				setTimeout(() => {
					player.pause(false);
				}, 1000);
			}
		}
	}
}

exports.PlayerMoveEvent = PlayerMoveEvent;
