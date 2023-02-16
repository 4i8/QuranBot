const { Listener, container } = require('@sapphire/framework');
const { MessageEmbed, Message } = require('discord.js');
const { embed, resolveKey } = require('../../lib/structures/exports.js');
const guildSchema = require('../../schema/guild');

class TrackStartEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'trackStart'
		});
	}

	/**
	 *
	 * @param {import('erela.js').Player} player
	 * @param {import('erela.js').Track} track
	 * @param {import('erela.js').TrackStartEvent} playload
	 */
	async run(player, track, payload) {
		const { client } = this.container;
		let components = [
			{
				type: 1,
				components: [
					{
						type: 2,
						emoji: client.config.emojis.audio_id.vol_down,
						style: 3,
						custom_id: 'vdown'
					},
					{
						type: 2,
						emoji: client.config.emojis.audio_id.pause,
						style: 3,
						custom_id: 'pause'
					},
					{
						type: 2,
						emoji: client.config.emojis.audio_id.stop,
						style: 3,
						custom_id: 'stop'
					},

					{
						type: 2,
						emoji: client.config.emojis.audio_id.skip,
						style: 3,
						custom_id: 'skip'
					},
					{
						type: 2,
						emoji: client.config.emojis.audio_id.vol_up,
						style: 3,
						custom_id: 'vup'
					}
				]
			}
		];
		const guild = client.guilds.cache.get(player.guild);
		const EMBED = new MessageEmbed()
			.setDescription(
				`**${await resolveKey({ guild: guild }, 'events:track_start_default_embed', {
					replace: {
						emoji: client.config.emojis.audio.play,
						title: track.title,
						requester: `${player.queue.current.requester}`
					}
				})}**`
			)
			.setColor(client.config.colors.Primary)
			.setTimestamp();

		/** @type {Message} */
		try {
			var NOW = await client.channels.cache.get(player.textChannel).send({
				embeds: [EMBED],
				components: components
			});
		} catch (e) {
			if (player) {
				player.destroy();
			}
			if (process.cache.tacs[player.guild]) {
				process.cache.tacs[player.guild].kill();
			}
			return;
		}
		const collector = NOW.createMessageComponentCollector({
			filter: async (b) => {
				if (b.guild.me.voice.channel && b.guild.me.voice.channelId === b.member.voice.channelId) return true;
				else {
					await b.deferReply({
						ephemeral: true
					});
					embed(
						b,
						await resolveKey({ guild: guild }, 'events:track_start_not_in_voice', {
							replace: {
								channel: `<#${b.guild.me.voice.channelId}>`
							}
						}),
						'p-',
						{
							interaction: {
								stats: true,
								ephemeral: true
							}
						}
					);
					return false;
				}
			},
			time: 0
		});
		player.MessagePlayer = NOW;
		player.MessagePlayercollector = collector;
		collector.on('collect', async (i) => {
			let player = client.manager.get(i.guildId);
			let evolume = client.config.emojis.audio.play;
			await i.deferUpdate().catch(() => {});
			if (!player || player.queue.size < 0 || !player.queue.current) {
				return collector.stop();
			}
			if (i.customId === 'vdown') {
				let volume = Number(player.volume) - 10;
				if (volume < 10)
					return i.editReply({
						embeds: [
							EMBED.setDescription(
								`**${await resolveKey({ guild: guild }, 'events:track_start_limited_volume', {
									replace: {
										play_emoji: client.config.emojis.audio.play,
										title: track.title,
										warn_emoji: client.config.emojis.warn
									}
								})}**`
							)
						]
					});
				if (volume > player.volume) {
					evolume = client.config.emojis.audio.vol_up;
				} else if (volume < player.volume) {
					evolume = client.config.emojis.audio.vol_down;
				} else {
					evolume = client.config.emojis.audio.play;
				}
				await player.setVolume(volume);
				i.editReply({
					embeds: [
						EMBED.setDescription(
							`**${await resolveKey({ guild: guild }, 'events:track_start_volume_now', {
								replace: {
									play_emoji: client.config.emojis.audio.play,
									title: track.title,
									volume_emoji: evolume,
									volume: `\`${volume}\``
								}
							})}**`
						)
					]
				});
			} else if (i.customId === 'stop') {
				await player.destroy();
				i.editReply({
					embeds: [
						EMBED.setDescription(
							`**${await resolveKey({ guild: guild }, 'events:track_start_stoped', {
								replace: {
									emoji: client.config.emojis.audio.stop,
									title: player.queue.current.title
								}
							})}**`
						)
					]
				});
				return collector.stop();
			} else if (i.customId === 'pause') {
				player.pause(!player.paused);
				const Text = player.paused
					? `${await resolveKey({ guild: guild }, 'events:track_start_paused', { replace: { emoji: client.config.emojis.audio.pause } })}`
					: `${await resolveKey({ guild: guild }, 'events:track_start_resumed', { replace: { emoji: client.config.emojis.audio.pause } })}`;
				i.editReply({
					embeds: [EMBED.setDescription(`**${client.config.emojis.audio.play} | ${track.title}\n${Text}**`)]
				});
			} else if (i.customId === 'skip') {
				await player.stop();
				i.editReply({
					embeds: [
						EMBED.setDescription(
							`**${await resolveKey({ guild: guild }, 'events:track_start_skipped', {
								replace: {
									emoji: client.config.emojis.audio.skip,
									title: player.queue.current.title
								}
							})}**`
						)
					]
				});
				return collector.stop();
			} else if (i.customId === 'vup') {
				let volume = Number(player.volume) + 10;
				if (volume > 150)
					return i.editReply({
						embeds: [
							EMBED.setDescription(
								`**${await resolveKey({ guild: guild }, 'events:track_start_limited_volume', {
									replace: {
										play_emoji: client.config.emojis.audio.play,
										title: track.title,
										warn_emoji: client.config.emojis.warn
									}
								})}**`
							)
						]
					});
				if (volume > player.volume) {
					evolume = client.config.emojis.audio.vol_up;
				} else if (volume < player.volume) {
					evolume = client.config.emojis.audio.vol_down;
				} else {
					evolume = client.config.emojis.audio.play;
				}
				await guildSchema.findOneAndUpdate(
					{
						guildID: i.guildId
					},
					{
						$set: {
							volume: volume
						}
					},
					{
						upsert: true
					}
				);
				await player.setVolume(volume);
				i.editReply({
					embeds: [
						EMBED.setDescription(
							`**${await resolveKey({ guild: guild }, 'events:track_start_volume_now', {
								replace: {
									play_emoji: client.config.emojis.audio.play,
									title: track.title,
									volume_emoji: evolume,
									volume: `\`${volume}\``
								}
							})}**`
						)
					]
				});
				return;
			}
		});
	}
}

exports.TrackStartEvent = TrackStartEvent;
