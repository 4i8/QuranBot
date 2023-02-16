let config = require('../config.json');
let emoji = config.emojis;

module.exports = {
	Permissions: {
		client: 'I must have a role that has ',
		User: 'You must have a role that has '
	},
	Prefix: 'Prefix',
	run: 'A command is already running',
	Readers: 'Readers:',
	nulldb: 'There are no data',
	Showreaders: 'Show readers:',
	EXAMPLE: 'EXAMPLE:',
	Request: 'Request',
	prefix: 'prefix',
	off: 'OFF',
	Supportlink: '[Support](https://discord.gg/3rZjSyS)',
	talkdev: 'You can talk to the developers via the link above\n\n[Support](https://discord.gg/3rZjSyS)',
	occurred: 'An error has occurred, please try again',
	Cooldowns: 'Cooldowns',
	invite: `[invite](${config.Links.invite})`,
	ifhelp: 'If you want more info about any command',
	commandname: 'command name',
	error: 'You must resume before using the command',
	very: '© All Rights Reserved Quran Bot Team',
	paypal: '[Donation link](https://www.paypal.me/QuranTeam)',
	errCountries: 'Please make sure that you have entered the name of the country or city correctly',
	Admin: {
		// settings //
		status: 'status',
		guildId: 'Guild ID',
		guildName: 'Guild Name',
		guildPrefix: 'Guild Prefix',
		Language: 'Language',
		Controller: 'Controller',
		Command: 'Command',
		guildName: 'Guild Name',
		khatm: 'Quran khatm',
		azkar: 'Azkar',
		voice: 'القناة الصوتية',
		// SetRole //
		mention: 'Mentions Roles',
		idrole: 'ID Role',
		NameRole: 'Name Role',
		rolestatus: 'Role status now',
		localrole: 'This role has already been determined.',
		// Prefix //
		prefixlength: 'The new prefix must be less than two (2) characters',
		beFOTE: 'This prefix is present before',
		Prefix: 'The prefix has been changed to',
		//Set-channel//
		Mentionschannel: 'Mentions channel',
		IDchannel: 'ID channel',
		Namechannel: 'Name channel',
		AredyChannel: 'This channel has already been determined.',
		commandstatusnow: 'command status now',
		voicestatusnow: 'voice channel status now',
		khatamstatusnow: 'khatam status now',
		reminderstatusnow: 'Ramadan reminder status now',
		CountdownRamadan: 'Countdown to the holy month of Ramadan',
		Doaa: ' Doaa first day in Ramadan',
		azkarstatusnow: 'azkar status now',
		//reset//
		truee: 'Are you sure about this process?',
		done: 'In this process it will be deleted',
		notdone: 'No data to reset',
		reset: 'Reset....',
		donereset: 'The settings were reset successfully',
		notdonereset: 'The settings reset has been successfully canceled'
	},
	audio: {
		nv: `Can't play here. You should be in this voice channel`,
		progressbar: 'Progress bar',
		left: 'Time left',
		Plsvoicec: 'Please join a voice channel first',
		must: 'Now you can use this command',
		notlisten: 'You must have a queue to use this command',
		volnow: 'Current volume level',
		notnumber: 'This is not a number !',
		limitvol: 'Limit the volume `10/150`',
		volchange: 'Volume has changed to',
		occurred: 'An error has occurred, please try again',
		stopQuran: 'The Quran has been stopped and the Queue removed',
		skipQuran: 'Skipped',
		QuranReders: 'reader',
		resumeFrom: 'The quran has been resume from now',
		resumAlready: 'The quran is already resume',
		listeningNow: `Are listening now ${emoji.chevron}`,
		Searcherr: 'Sorry, there are no matching search results. Please enter the correct name or number of Surat',
		Queue: 'Queue',
		Suratarrangement: 'Surat Order',
		addQueue: 'Has been added',
		donePlay: 'Play now',
		a1: 'Name Surat',
		a2: 'Number Surat',
		a3: 'all',
		all: 'all',
		play: 'play',
		quranPause: 'The quran has been paused from now',
		alreadyPause: 'The quran is already paused',
		repeatQuran: 'repeat',
		Onrepeat: 'on',
		Offrepeat: 'off',
		Warnrepeat: 'Warning:\n No play message is send every time you play to not disturb bot users',
		Clearqueue: 'The Queue has been cleared',
		endREDERS: "I've finished the time of choice",
		reactionEND: 'Please wait until the reaction is finished',
		TineoutRecat: `Please wait until the reactions is complete\nWarning:\n You have only \`15\` seconds`,
		ReadersEmbed: `
        1-Abdul Basset Abdel Samad
        2-Mashary Aallasi
        3-Fares Abbad
        4-Maher Al-Muayaqali
        5-Mohammed Al-Manshawi
        6-Yasser Al-Dosari

        Random selection:${emoji.audio.Shufel}`,
		deafen: 'Please un deafen to use this command',
		resumenow: 'Please resume Quran to use this command'
	},
	Musahaf: {
		NumberPage: 'Number Page',
		NameSurah: 'Name Surat',
		musahaf: 'quran',
		NumberSurah: 'Number Surat',
		Searcherr: 'Sorry, there are no matching search results. Please correctly type the name, number or page number of a Surat.',
		ydhd: 'Sorry, you do not have any storage for pages in the databases. ',
		type: 'Surat Type',
		Surah: 'Surat',
		numberverses: 'verses',
		quailtybad: '`If the quality is poor`\n `this is from the discord`',
		Mypage: 'mypage'
	}
};
