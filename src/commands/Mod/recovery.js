const { Command } = require('@sapphire/framework');
const readers = require('../../data/audio/reader.json');
const surahs = require('../../data/surah/array.json');
const surahsNAME = require('../../data/surah/name.json');
const { embed, resolveKey } = require('../../lib/structures/exports');
const guildSchema = require('../../schema/guild');
const stringSimilarity = require('string-similarity');
const recoverySchema = require('../../schema/recovery.js');
const debug = require('debug')('bot:recovery');
class RecoveryCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'recovery',
			description: 'recovery mood/وضع الاسترداد إذا تم إعادة تشغيل البوت',
			preconditions: ['GuildOnly', 'HasPerm', 'HasPermUser', 'InVoice']
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
					type: 'STRING',
					name: 'القارئ-reader',
					description: "اسم القارئ أو رقمه/reader's name or id",
					autocomplete: true,
					required: true
				},
				{
					type: 'STRING',
					name: 'السورة-surah',
					description: "اسم السورة أو الرقم/surah's name or number",
					autocomplete: true,
					required: true
				}
			]
		});
	}

	/**
	 *
	 * @param {Command.AutocompleteInteraction} interaction
	 */
	async autocompleteRun(interaction) {
		try {
			let language = (await guildSchema.findOne({ guildID: interaction.guild.id }).then((res) => res.language)) || 'AR';
			const focused = interaction.options.getFocused(true);
			if (focused.name == 'السورة-surah') {
				const matches = stringSimilarity.findBestMatch(
					focused.value,
					surahs.map((surah) => surah.name) ||
					stringSimilarity.findBestMatch(
						focused.value,
						surahs.map((surah) => surah.transliteration_en)
					) ||
					stringSimilarity.findBestMatch(
						focused.value,
						surahs.map((surah) => surah.id.toString())
					)
				);
				const filtered = [
					{
						id: 0,
						name: 'القرآن كاملاً',
						transliteration_en: 'The whole Quran'
					}
				];
				filtered.push(
					...surahs
						.filter((surah, index) =>
							matches.ratings > 0
								? (surah.id == parseInt(focused.value) ||
									surah.name.includes(focused.value) ||
									surah.transliteration_en.includes(focused.value)) &&
								index !== matches.bestMatchIndex
								: surah.id == parseInt(focused.value) ||
								surah.name.includes(focused.value) ||
								surah.transliteration_en.includes(focused.value)
						)
						.concat(matches.ratings > 0 ? surahs[matches.bestMatchIndex] : [])
						.slice(0, 24)
				);
				try {
					await interaction.respond(
						filtered.map((s) => ({
							name: `${s.id == `0` ? '' : `${s.id}-`}${language !== 'AR' ? s.transliteration_en : s.name}`,
							value: s.id.toString()
						}))
					);
				} catch (error) {
					debug(error);
				}
			} else if (focused.name == 'القارئ-reader') {
				const filtered = readers
					.filter((reader) => reader.id === focused.value || reader.name.includes(focused.value) || reader.name_en.includes(focused.value))
					.slice(0, 25);
				try {
					await interaction.respond(
						filtered.map((r) => ({
							name: `${r.id}-${language !== 'AR' ? r.name_en : r.name} ${r?.rewaya ? `(${r.rewaya})` : ''}`,
							value: r.id.toString()
						}))
					);
				} catch (error) {
					debug(error);
				}
			}
		} catch (error) {
			debug(error);
		}
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
		// Get the reader and surah
		let surahID = interaction.options.getString('السورة-surah');
		let readerID = interaction.options.getString('القارئ-reader');
		// Check if the reader exists or surah exists
		let reader = readers.filter((r) => r.id == parseInt(readerID))[0];
		let surah = surahs.filter((s) => s.id == parseInt(surahID));
		surah = parseInt(surahID) == 0 ? surahsNAME['كامل'] : surah[0];
		if (!surah || !reader) {
			embed(
				interaction,
				await resolveKey(interaction, 'commands:wrong_options', {
					replace: {
						emoji: client.emoji.error
					}
				}),
				'e',
				{
					interaction: {
						stats: true
					}
				}
			);
			return;
		}
		const findRecovery = await recoverySchema.findOne({
			guildID: interaction.guildId
		});
		if (findRecovery) {
			findRecovery.requester = interaction.user.id;
			findRecovery.voiceID = interaction.member.voice.channelId;
			findRecovery.key = `${surahID}&${readerID}`;
			await findRecovery.save();
		} else {
			new recoverySchema({
				guildID: interaction.guildId,
				requester: interaction.user.id,
				voiceID: interaction.member.voice.channelId,
				key: `${surahID}&${readerID}`
			}).save();
		}
		embed(interaction, await resolveKey(interaction, 'commands:recovery_mood'), 'p', {
			interaction: {
				stats: true
			}
		});
	}
}

exports.RecoveryCommand = RecoveryCommand;
