const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');
async function buildStructure() {
	const types = await fs.readdir(path.resolve(__dirname, './commands'));
	const i8 = await fs.readdir(path.resolve(__dirname, './languages'));
	const req = [];
	var commands = [];
	process.commandsCache = process.commandsCache || {};
	for (let index = 0; index < types.length; index++) {
		const type = types[index];
		glob.sync(path.resolve(__dirname, `./commands/${type}/*.js`)).forEach((file) => {
			let name = file.match(/\/([^\/]+)\.js$/)[1];
			if (!process.commandsCache[type]) {
				process.commandsCache[type] = [];
			}
			process.commandsCache[type].push(name);
		});
	}
	for (let i = 0; i < i8.length; i++) {
		const structurePath = path.resolve(__dirname, `./languages/${i8[i]}/structure.json`);
		var data = await fs
			.readFile(structurePath, {
				encoding: 'utf-8'
			})
			.then((a) => JSON.parse(a));
		let y = false;
		commands
			.filter((a) => !data[a]?.length)
			.forEach((name) => {
				data[name] = '';
				y = true;
				req.push(`\x1B[31mWARN:\x1B[0m ${structurePath}:${name} is required`);
			});
		if (y) {
			await fs.writeFile(structurePath, JSON.stringify(data));
		}
	}
	return req;
}
module.exports = buildStructure;
