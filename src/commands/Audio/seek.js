const { convertTime } = require('../../lib/utils/convert');
const { toMilliseconds } = require('colon-notation');
const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');


class SeekCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'seek',
			description: 'تقديم القرآن / Seek the audio',
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
			dm_permission: false,
			options: [
				{
					name: 'notation',
					description: 'T:T:T like 2:30:10',
					required: true,
					type: 'STRING'
				}
			]
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
		const notation = interaction.options.getString('notation');
		const time = toMilliseconds(notation);
		const position = player.position;
		const duration = player.queue.current.duration;
		const emojiforward = client.emoji.audio.forward;
		const emojirewind = client.emoji.audio.backward;
		if (time <= duration) {
			if (time > position) {
				player.seek(time);
				return embed(interaction, await resolveKey(interaction, "commands:seek_forward", {
					replace: {
						emoji: emojiforward,
						time: `${convertTime(time)} - ${convertTime(duration)}`
					}
				}),
				 'p-', {
					interaction: {
						stats: true
					}
				});
			} else {
				player.seek(time);
				return embed(interaction, await resolveKey(interaction, "commands:seek_backward", {
					replace: {
						emoji: emojirewind,
						time: `${convertTime(time)} - ${convertTime(duration)}`
					}
				}),
				 'p-', {
					interaction: {
						stats: true
					}
				});
			}
		} else {
			return embed(interaction, await resolveKey(interaction, 'commands:seek_error', {
				replace: {
					emoji: client.emoji.warn
				}
			}),
			 'p-', {
				interaction: {
					stats: true
				}
			});
		}
	}
}

exports.SeekCommand = SeekCommand;
