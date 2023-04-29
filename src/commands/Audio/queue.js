const load = require('lodash');
const { convertTime } = require('../../lib/utils/convert');
const { progressbar } = require('../../lib/utils/progressbar');
const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');

class QueueCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'queue',
			description: 'قائمة الانتظار/queue',
			preconditions: ['GuildOnly', 'HasPerm', 'InVoice', 'SameVoice', 'HasCurrent', 'HasRecovery', 'HasPlayer']
		});
	}

	/**
	 *
	 * @param {Command.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			dm_permission: false
		});
	}
	/**
	 *
	 * @param {Command.ChatInputInteraction} interaction
	 */
	async chatInputRun(interaction) {
		await interaction.deferReply({
			ephemeral: false
		});
		const { client } = this.container;
		let player = client.manager.get(interaction.guildId);
		let QuranAudio = player.queue.current;
		var total = QuranAudio.duration;
		var current = player.position;
		if (!player.queue.size || player.queue.size === 0) {
			return embed(
				interaction,
				await resolveKey(interaction, 'commands:queue_display', {
					replace: {
						play_emoji: client.emoji.audio.play,
						chevron_emoji: client.emoji.chevron,
						title: QuranAudio.title,
						requester: `<@!${QuranAudio.requester.id}>`,
						bar: progressbar(player),
						extra: `\`${convertTime(current)} - ${convertTime(total)}\``
					}
				}),
				'p-',
				{
					interaction: {
						stats: true
					}
				}
			);
		} else {
			const mapping = player.queue.map((t, i) => `\`${++i}\` - ${t.title} - [${t.requester}]`);

			const chunk = load.chunk(mapping, 5);
			const pages = chunk.map((s) => s.join('\n'));
			let page = 0;
			if (player.queue.size < 5 || player.queue.totalSize < 5) {
				embed(
					interaction,
					await resolveKey(interaction, 'commands:queue_display', {
						replace: {
							play_emoji: client.emoji.audio.play,
							chevron_emoji: client.emoji.chevron,
							title: QuranAudio.title,
							requester: `<@!${QuranAudio.requester.id}>`,
							bar: progressbar(player),
							extra: pages[page]
						}
					}),
					'p-',
					{
						interaction: {
							stats: true
						}
					}
				);
			} else {
				const KEY = interaction.user.id + String(Date.now());
				let components = [
					{
						type: 1,
						components: [
							{
								type: 2,
								emoji: client.emoji.audio_id.backward,
								style: 4,
								custom_id: 'queue_backward' + KEY
							},
							{
								type: 2,
								style: 1,
								custom_id: 'queue_page' + KEY,
								label: `${page + 1}/${pages.length}`,
								disabled: true
							},
							{
								type: 2,
								emoji: client.emoji.audio_id.forward,
								style: 3,
								custom_id: 'queue_forward' + KEY
							}
						]
					}
				];
				embed(
					interaction,
					await resolveKey(interaction, 'commands:queue_display', {
						replace: {
							play_emoji: client.emoji.audio.play,
							chevron_emoji: client.emoji.chevron,
							title: QuranAudio.title,
							requester: `<@!${QuranAudio.requester.id}>`,
							bar: progressbar(player),
							extra: pages[page]
						}
					}),
					'p-',
					{
						interaction: {
							stats: true
						},
						components: components
					}
				);
				const collector = interaction.channel.createMessageComponentCollector({
					filter: async (b) => {
						if (b.user.id !== interaction.user.id) {
							await b.deferReply({
								ephemeral: true
							});
							embed(b, await resolveKey(interaction, 'commands:queue_no_permission'), 'e', {
								interaction: {
									stats: true,
									ephemeral: true
								}
							});
							return false;
						} else {
							return true;
						}
					},
					time: 60 * 1000 * 10
				});

				collector.on('collect', async (button) => {
					player = interaction.client.manager.get(interaction.guildId);
					if (!player) {
						collector.stop();
						return embed(interaction, await resolveKey(interaction, 'commands:queue_session_end'), 'e', {
							interaction: {
								stats: true
							},
							components: []
						});
					}
					if (button.customId === 'queue_forward' + KEY) {
						await button.deferUpdate().catch(() => {});
						page = page + 1 < pages.length ? ++page : 0;
						components = [
							{
								type: 1,
								components: [
									{
										type: 2,
										emoji: client.emoji.audio_id.backward,
										style: 4,
										custom_id: 'queue_backward' + KEY
									},
									{
										type: 2,
										style: 1,
										custom_id: 'queue_page' + KEY,
										label: `${page + 1}/${pages.length}`,
										disabled: true
									},
									{
										type: 2,
										emoji: client.emoji.audio_id.forward,
										style: 3,
										custom_id: 'queue_forward' + KEY
									}
								]
							}
						];
						embed(
							interaction,
							await resolveKey(interaction, 'commands:queue_display', {
								replace: {
									play_emoji: client.emoji.audio.play,
									chevron_emoji: client.emoji.chevron,
									title: QuranAudio.title,
									requester: `<@!${QuranAudio.requester.id}>`,
									bar: progressbar(player),
									extra: pages[page]
								}
							}),
							'p-',
							{
								interaction: {
									stats: true
								},
								components: components
							}
						);
					} else if (button.customId === 'queue_backward' + KEY) {
						await button.deferUpdate().catch(() => {});
						page = page > 0 ? --page : pages.length - 1;
						components = [
							{
								type: 1,
								components: [
									{
										type: 2,
										emoji: client.emoji.audio_id.backward,
										style: 4,
										custom_id: 'queue_backward' + KEY
									},
									{
										type: 2,
										style: 1,
										custom_id: 'queue_page' + KEY,
										label: `${page + 1}/${pages.length}`,
										disabled: true
									},
									{
										type: 2,
										emoji: client.emoji.audio_id.forward,
										style: 3,
										custom_id: 'queue_forward' + KEY
									}
								]
							}
						];
						embed(
							interaction,
							await resolveKey(interaction, 'commands:queue_display', {
								replace: {
									play_emoji: client.emoji.audio.play,
									chevron_emoji: client.emoji.chevron,
									title: QuranAudio.title,
									requester: `<@!${QuranAudio.requester.id}>`,
									bar: progressbar(player),
									extra: pages[page]
								}
							}),
							'p-',
							{
								interaction: {
									stats: true
								},
								components: components
							}
						);
					}
				});
				collector.on('end', async () => {
					if (!player)
						return embed(interaction, await resolveKey(interaction, 'commands:queue_session_end'), 'e', {
							interaction: {
								stats: true
							},
							components: []
						});
					embed(
						interaction,
						await resolveKey(interaction, 'commands:queue_display', {
							replace: {
								play_emoji: client.emoji.audio.play,
								chevron_emoji: client.emoji.chevron,
								title: QuranAudio.title,
								requester: `<@!${QuranAudio.requester.id}>`,
								bar: progressbar(player),
								extra: pages[page]
							}
						}),
						'p-',
						{
							interaction: {
								stats: true
							},
							components: []
						}
					);
				});
			}
		}
	}
}

exports.QueueCommand = QueueCommand;
