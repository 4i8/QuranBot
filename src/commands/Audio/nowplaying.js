const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');
const { convertTime } = require('../../lib/utils/convert.js');
const { progressbar } = require('../../lib/utils/progressbar.js');
class NowplayingCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'nowplaying',
			description: 'الصوت الحالي/now playing',
			preconditions: ['GuildOnly', 'HasPerm', 'HasCurrent', 'HasRecovery', 'HasPlayer']
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
		const QuranAudio = player.queue.current;
		var total = QuranAudio.duration;
		var current = player.position;
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
	}
}

exports.NowplayingCommand = NowplayingCommand;
