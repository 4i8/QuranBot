const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');
const glob = require('glob');
class HelpCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'help',
			description: 'معرفة خريطة البوت / Know bot map'
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
		const { client } = this.container;
		await interaction.deferReply({
			ephemeral: false
		});
		const types = {
			Audio: '🔉',
			Mod: '🔧',
			Public: '🌍'
		};
		const KEY = interaction.user.id + String(Date.now());
		let components = [
			{
				type: 1,
				components: Object.keys(types).map((type) => {
					return {
						type: 2,
						style: 1,
						custom_id: type + KEY,
						emoji: types[type]
					};
				})
			},
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 5,
						label: 'الدعم الفني/Support',
						url: client.config.Links.server
					},
					{
						type: 2,
						style: 5,
						label: 'دعوة/Invite',
						url: client.config.Links.invite
					},
					{
						type: 2,
						style: 5,
						label: 'المصدر/Source',
						url: 'https://github.com/4i8/quranbot.git'
					}
				]
			}
		];
		embed(interaction, await resolveKey(interaction, 'commands:help'), 'p-', {
			interaction: {
				stats: true
			},
			components: components
		});
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
			Object.keys(types).forEach(async (type) => {
				if (button.customId === type + KEY) {
					await button.deferUpdate().catch(() => {});
					components = [
						{
							type: 1,
							components: Object.keys(types).map((type) => {
								if (button.customId === type + KEY) {
									return {
										type: 2,
										style: 3,
										custom_id: type + KEY,
										emoji: types[type],
										disabled: true
									};
								} else
									return {
										type: 2,
										style: 1,
										custom_id: type + KEY,
										emoji: types[type]
									};
							})
						},
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 5,
									label: 'الدعم الفني/Support',
									url: client.config.Links.server
								},
								{
									type: 2,
									style: 5,
									label: 'دعوة/Invite',
									url: client.config.Links.invite
								},
								{
									type: 2,
									style: 5,
									label: 'المصدر/Source',
									url: 'https://github.com/4i8/quranbot.git'
								}
							]
						}
					];
					embed(
						interaction,
						await Promise.all(
							process.commandsCache[type].map(async (a) => `\`/${a}\`\n •  ` + (await resolveKey(interaction, `structure:${a}`)))
						).then((a) => a.join('\n')),
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
		});
	}
}

exports.HelpCommand = HelpCommand;
