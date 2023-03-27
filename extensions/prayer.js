const mongoose = require('mongoose');
const { settings, ...config } = require('../src/config.json');
const { WebhookClient, MessageEmbed } = require('discord.js');
const { hook } = require('../src/lib/utils/hook');
const guildSchema = require('../src/schema/guild');
const { resolveKey } = require('../src/lib/structures/exports');
const prayerSchema = require('../src/schema/prayer');
const prayer = require('../src/data/prayer.json');
const fetch = require('node-fetch').default;
const moment = require('moment-timezone');
const Conveyor = require('tacs');
const chalk = require('chalk');
const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve(true), ms));
mongoose
	.connect(settings.Mongo_DB, {
		dbName: 'quran',
		keepAlive: true,
		keepAliveInitialDelay: 10000
	})
	.then(async () => {
		process.prayerCache = {
			countries: [],
			blacklist: [],
			tacs: [],
			list: []
		};
		console.log('Connect To MongoDB Successfully');
		console.log('Prayer Started Successfully');
		for (let index = 0; index < prayer.countries.length; index++) {
			const { timezone, country } = prayer.countries[index];
			process.prayerCache.tacs[country] = new Conveyor();
			let tacs = process.prayerCache.tacs[country];
			console.log(`${chalk.blue('[COUNTRY]')} [${chalk.green(country)}]:${chalk.yellow(timezone)}`);
			setInterval(async () => {
				// console.log('Prayer Started For ' + country);
				if (process.prayerCache.countries[country] === true) return;
				process.prayerCache.countries[country] = true;
				if (!process.prayerCache.blacklist[country]) process.prayerCache.blacklist[country] = [];
				const FindCountry = await prayerSchema.findOne({ country: country });
				const BasisDate = moment().tz(timezone).format('DD-MM-YYYY');
				let BasisTime = moment().tz(timezone).format('HH:mm'); // convertTime(moment().tz(timezone).format('HH:mm'));
				// BasisTime = BasisTime.split(':')[0].split('')[0] === '0' ? BasisTime.replace(/0/, '') : BasisTime;
				const DataPrayer = !FindCountry
					? await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${country}`)
						.then((res) => res.json())
						.then((json) => {
							if (json?.message === 'API rate limit exceeded') return false;
							return Object.assign(
								{ date: json.data.date.gregorian.date },
								Object.assign(
									Object.keys(json.data.timings)
										.filter(
											(x) => x !== 'Imsak' && x !== 'Midnight' && x !== 'Firstthird' && x !== 'Lastthird' && x !== 'Sunset'
										)
										.map((x) => {
											return {
												[x.toLowerCase().replace('sunrise', 'shurooq')]: json.data.timings[x]
											};
										})
								).reduce((a, b) => Object.assign(a, b), {})
							);
						})
						.catch((err) => {
							console.log(err);
							hook(err.toString()).error();
						})
					: FindCountry.prayer[0]?.date !== BasisDate
						? await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${country}`)
							.then((res) => res.json())
							.then((json) => {
								if (json?.message === 'API rate limit exceeded') return false;
								return Object.assign(
									{ date: json.data.date.gregorian.date },
									Object.assign(
										Object.keys(json.data.timings)
											.filter(
												(x) => x !== 'Imsak' && x !== 'Midnight' && x !== 'Firstthird' && x !== 'Lastthird' && x !== 'Sunset'
											)
											.map((x) => {
												return {
													[x.toLowerCase().replace('sunrise', 'shurooq')]: json.data.timings[x]
												};
											})
									).reduce((a, b) => Object.assign(a, b), {})
								);
							})
							.catch((err) => {
								console.log(err);
								hook(err.toString()).error();
							})
						: FindCountry;
				if (!DataPrayer) return;
				process.prayerCache.countries[country] = false;
				if (!FindCountry) {
					console.log(`${chalk.blue("[PRAYER]")} ${chalk.yellow(`${country} is not found in database`)}`);
					const newPrayer = new prayerSchema({
						country: country,
						prayer: DataPrayer
					});
					await newPrayer.save();
					return;
				} else {
					// console.log('Prayer is already');
					if (FindCountry && FindCountry.prayer[0]?.date !== BasisDate) {
						console.log(`${chalk.blue("[PRAYER]")} ${chalk.yellow(`Data for ${country} is not updated`)}`);
						await prayerSchema.findOneAndUpdate(
							{ country: country },
							{
								$set: {
									prayer: DataPrayer,
									blacklist: []
								}
							}
						);
						process.prayerCache.blacklist[country] = [];
						return;
					} else {
						Object.keys(DataPrayer.prayer[0]).forEach(async (key) => {
							if (key === 'date') return;
							if (
								DataPrayer.prayer[0][key] === BasisTime &&
								!FindCountry.blacklist.includes(key) &&
								!process.prayerCache.blacklist[country].includes(key)
							) {
								process.prayerCache.blacklist[country].push(key);
								tacs.add({
									key: key,
									country: country,
									secret: key + country + BasisDate
								});
							}
						});
					}
				}
			}, 5000);
			tacs.$lab(async ({ key, country, secret }, index, remove) => {
				if (remove || process.prayerCache.list.includes(secret)) {
					return tacs.next().catch(() => { });
				}
				process.prayerCache.list.push(secret);
				tacs.get({ secret: secret }).remove();
				console.log(`${chalk.blue("[PRAYER]")} ${chalk.yellow(`${key} is started in ${country}`)}`);
				await prayerSchema.findOneAndUpdate(
					{ country: country },
					{
						$push: {
							blacklist: key
						}
					},
					{
						upsert: true
					}
				);
				const FindGuild = await guildSchema.find({ 'prayer.country': country });
				FindGuild.forEach(async (data) => {
					data.prayer
						.filter((data) => data.country === country && data?.channelID !== null)
						.forEach(async (FindPrayer) => {
							let msg = prayer.countries.filter((data) => data.country === country)[0]
							new WebhookClient({
								id: FindPrayer.webhookID,
								token: FindPrayer.webhookToken
							})
								.send({
									embeds: [
										new MessageEmbed()
											.setTitle(
												await resolveKey({ guild: data.guildID }, `extc:${key}`, {
													replace: {
														country: data.language === 'AR' ? msg.name : msg.en_name
													}
												})
											)
											.setColor(config.colors.Primary)
											.setTimestamp()
									],
									content: `${FindPrayer?.mention ? `${FindPrayer.mention}` : '\n'}`
								})
								.catch(async (error) => {
									if (error.code === 10015 || error.code === 50027) {
										await guildSchema.findOneAndUpdate(
											{
												guildID: data.guildID,
												'prayer.channelID': FindPrayer.channelID
											},
											{
												$set: {
													'prayer.$.channelID': null
												}
											}
										);
									}
									hook(error.toString()).error();
								});
						});
				});
				tacs.next().catch(() => { });
			});
			await wait(6000);
		}
	})
	.catch(() => {
		throw new Error('Connect To MongoDB Failed');
	});
