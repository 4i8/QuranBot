const { Command } = require('@sapphire/framework');
const surahs = require('../../data/surah/array.json');
const { embed } = require('../../lib/structures/exports');
const musahafSchema = require('../../schema/musahaf');
const Quran = require('../../data/surah/quran');
const guildSchema = require('../../schema/guild');
const stringSimilarity = require('string-similarity');

class QuranCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'quran',
			description: 'المصحف/To see the all pages of Quran'
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
					name: 'السورة-surah',
					description: 'اسم السورة او رقم الصفحة/Name of surah or number of page',
					autocomplete: true
				}
			]
		});
	}

	/**
	 *
	 * @param {Command.AutocompleteInteraction} interaction
	 */
	async autocompleteRun(interaction) {
		let language = (await guildSchema.findOne({ guildID: interaction.guild.id }).then((res) => res.language)) || 'AR';
		const focused = interaction.options.getFocused(true);
		if (focused.name == 'السورة-surah') {
			const filtered = [];
			const rgx = /_true|_false/g;
			focused.value = focused.value.replace(rgx, '');
			const matches = stringSimilarity.findBestMatch(
				focused.value.toLowerCase(),
				surahs.map((surah) => surah.name.toLowerCase()) ||
					stringSimilarity.findBestMatch(
						focused.value.toLowerCase(),
						surahs.map((surah) => surah.transliteration_en.toLowerCase())
					) ||
					stringSimilarity.findBestMatch(
						focused.value.toLowerCase(),
						surahs.map((surah) => surah.id.toString())
					)
			);
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
			if (Quran[`${focused.value}`]) {
				filtered.push(Quran[`${focused.value}`]);
			}
			await interaction.respond(
				filtered.map((s) => ({
					name: `${s?.all ? (language !== 'AR' ? 'page-' : 'الصفحة-') : language !== 'AR' ? 'ranks-' : 'الترتيب-'}${
						s.name.length > 99 ? (language !== 'AR' ? s.nameall_en : s.nameall) : language !== 'AR' ? s.transliteration_en : s.name
					}`,
					value: s?.all ? `${s.page.toString()}_true` : `${s.id.toString()}_false`
				}))
			);
		}
	}

	/**
	 *
	 * @param {Command.ChatInputInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const FindGuild = await guildSchema.findOne({
			guildID: interaction.guildId
		});
		let tl = FindGuild?.language || 'AR';
		const lang = require(`../../language_extc/${tl}.js`);
		await interaction.deferReply({
			ephemeral: false
		});
		const { client } = this.container;
		// Get the reader and surah
		let RES = interaction.options.getString('السورة-surah')?.split('_');
		//DataBase
		const data = await musahafSchema.findOne({ userID: interaction.user.id });
		if (!data) {
			const newData = new musahafSchema({
				userID: interaction.user.id
			});
			await newData.save();
		}
		let [page, stats] = !RES ? [!data ? 1 : !data?.page ? 1 : data?.page, 'true'] : RES;
		let surah = stats === 'true' ? Quran[`${page}`] : surahs[`${page - 1}`];
		if (!surah?.page) surah = Quran[`1`];
		let components = [
			{
				type: 1,
				components: [
					{
						type: 2,
						emoji: client.emoji.audio_id.backward,
						style: 4,
						custom_id: 'quran&-&backward&-&' + interaction.user.id + '&-&' + surah.page
					},
					{
						type: 2,
						emoji: client.emoji.data,
						style: 1,
						custom_id: 'quran&-&backup&-&' + interaction.user.id + '&-&' + surah.page
					},
					{
						type: 2,
						emoji: client.emoji.audio_id.forward,
						style: 3,
						custom_id: 'quran&-&forward&-&' + interaction.user.id + '&-&' + surah.page
					}
				]
			}
		];
		let transliteration = `**•\`${tl == 'AR' ? surah.name : 'Surah ' + surah.transliteration_en}\`\n \n•${lang.Musahaf.type}\`${
			tl == 'AR' ? surah.type_ar : surah.type_en
		}\` •${lang.Musahaf.numberverses} \`${surah.verses}\`\n\n${lang.Musahaf.quailtybad}**`;
		if (surah.verses === true) transliteration = `**${tl == 'AR' ? surah.name : surah.transliteration_en}**`;
		embed(interaction, transliteration, 'p-', {
			title: `${lang.Musahaf.NumberPage} ${surah.page}`,
			interaction: {
				stats: true
			},
			file: {
				attachment: `attachment://${surah.page}.jpg`
			},
			components: components,
			files: [surah.musahaf]
		});
	}
}

exports.QuranCommand = QuranCommand;
