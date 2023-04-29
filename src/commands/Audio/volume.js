const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');
const guildSchema = require('../../schema/guild');

class VolumeCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'volume',
			description: 'تغيير مستوى الصوت/change audio volume',
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
					name: 'number',
					description: 'مستوى الصوت/volume number',
					required: true,
					type: 'NUMBER'
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
		var emojivolume = client.emoji.audio.vol_up;
		const vol = interaction.options.getNumber('number');
		const volume = Number(vol);

		if (!volume || volume < 10 || volume > 150)
			return embed(interaction, `${client.emoji.warn} | ${await resolveKey(interaction, 'commands:volume_limit')}`, 'w-', {
				interaction: {
					stats: true
				}
			});
		if (volume > player.volume) {
			emojivolume = client.emoji.audio.vol_up;
		} else if (volume < player.volume) {
			emojivolume = client.emoji.audio.vol_down;
		} else {
			emojivolume = client.emoji.audio.play;
		}
		player.setVolume(volume);
		await guildSchema.findOneAndUpdate(
			{
				guildID: interaction.guildId
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
		return embed(interaction, `${emojivolume} | ${await resolveKey(interaction, 'commands:volume_now')} \`${volume}\``, 'p-', {
			interaction: {
				stats: true
			}
		});
	}
}

exports.VolumeCommand = VolumeCommand;
