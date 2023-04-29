let config = require('../config.json');
let emoji = config.emojis;

module.exports = {
	Permissions: {
		client: 'Je dois avoir un rôle qui a ',
		User: 'Vous devez avoir un rôle qui a '
	},
	Prefix: 'Préfixe',
	run: "Une commande est déjà en cours d'exécution",
	Readers: 'Lecteurs:',
	nulldb: 'There are no data',
	Showreaders: 'Afficher les lecteurs:',
	EXAMPLE: 'EXEMPLE:',
	Request: 'Demander',
	Prefix: 'Préfixe',
	Supportlink: '[Support](https://discord.gg/3rZjSyS)',
	talkdev: 'Vous pouvez parler aux développeurs via le lien ci-dessus\n\n[Support](https://discord.gg/3rZjSyS)',
	occurred: "Une erreur s'est produite, veuillez réessayer",
	Cooldowns: 'Cooldowns',
	invite: `[invite](${config.Links.invite})`,
	ifhelp: "Si vous voulez plus d'informations sur n'importe quelle commande",
	commandname: 'nom de commande',
	error: "Vous devez reprendre avant d'utiliser la commande",
	very: '© Tous droits réservés Equipe Quran Bot',
	paypal: '[Lien de donation](https://www.paypal.me/QuranTeam)',
	errCountries: 'Veuillez vous assurer que vous avez correctement saisi le nom du pays ou de la ville',
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
		khatm: 'Quran Khatm',
		azkar: 'Azkar',
		voice: 'Voice Channel',
		// SetRole //
		mention: 'Mention des rôles',
		idrole: "Rôle d'identification",
		NameRole: 'Rôle de nom',
		rolestatus: 'Etat du rôle maintenant',
		localrole: 'Ce rôle a déjà été déterminé.',
		// Prefix //
		prefixlength: 'Le nouveau préfixe doit être inférieur à deux (2) caractères',
		beFOTE: 'Ce préfixe est présent avant',
		Prefix: 'Le préfixe a été changé en',
		//Set-channel//
		Mentionschannel: 'Mention de canal',
		IDchannel: "Canal d'identité",
		Namechannel: 'Nom du canal',
		AredyChannel: 'Ce canal a déjà été déterminé.',
		commandstatusnow: 'statut de commande maintenant',
		voicestatusnow: 'statut de channel voice maintenant',
		khatamstatusnow: 'statut de khatam maintenant',
		azkarstatusnow: 'statut de azkar maintenant',
		reminderstatusnow: 'Ramadan reminder de maintenant',
		CountdownRamadan: 'Compte à rebours pour le mois sacré du Ramadan',
		Doaa: 'Doaa premier jour du Ramadan',
		//reset//
		truee: 'Êtes-vous sûr de ce processus?',
		done: 'Dans ce processus, il sera supprimé',
		notdone: 'Aucune donnée à réinitialiser',
		reset: 'Réinitialiser....',
		donereset: 'Les paramètres ont été réinitialisés avec succès',
		notdonereset: 'La réinitialisation des paramètres a été annulée avec succès'
	},
	audio: {
		nv: 'Je ne peux pas jouer ici. Vous devriez être dans ce canal vocal',
		progressbar: 'Progress bar',
		left: 'Temps restant',
		Plsvoicec: "S'il vous plaît rejoindre d'abord un canal vocal",
		must: 'Vous pouvez maintenant utiliser cette commande',
		notlisten: "Vous devez avoir une file d'attente pour utiliser cette commande",
		volnow: 'Niveau de volume actuel',
		notnumber: "Ce n'est pas un nombre !",
		limitvol: 'Limiter le volume `10/150`',
		volchange: 'Le volume a changé pour',
		occurred: "Une erreur s'est produite, veuillez réessayer",
		stopQuran: "Le Quran a été arrêté et la file d'attente enlevée",
		skipQuran: 'Ignoré',
		QuranReders: 'lecteur',
		resumeFrom: 'Le Quran a été repris à partir de maintenant',
		resumAlready: 'Le Quran reprend déjà',
		listeningNow: `Écoute maintenant ${emoji.chevron}`,
		Searcherr: "Désolé, il n'y a pas de résultats de recherche correspondants.S'il vous plaît entrer le nom ou le numéro correct de Surat",
		Queue: "File d'attente",
		Suratarrangement: 'Ordre de sourate',
		addQueue: 'A été ajouté',
		donePlay: 'Joue maintenant',
		a1: 'Nom sourate',
		a2: 'Numéro de sourate',
		a3: 'tout',
		all: 'tout',
		play: 'play',
		quranPause: 'Le Quran a été Arrêter à partir de maintenant',
		alreadyPause: 'Le Quran est déjà en pause',
		repeatQuran: 'répéter',
		Onrepeat: 'allumer',
		Offrepeat: 'éteindre',
		Warnrepeat: "Avertissement:\n Aucun message de jeu n'est envoyé à chaque fois que vous jouez pour ne pas déranger les utilisateurs de Bot",
		Clearqueue: "La file d'attente a été effacée",
		endREDERS: "J'ai fini le temps de choix",
		reactionEND: "Veuillez patienter jusqu'à ce que la réaction soit terminée",
		TineoutRecat: `Veuillez patienter jusqu'à ce que les réactions soient complètes\nAvertissement:\nVous avez seulement \`15\` seconds`,
		ReadersEmbed: `
        1-Abdul Basset Abdel Samad
        2-Mashary Aallasi
        3-Fares Abbad
        4-Maher Al-Muayaqali
        5-Mohammed Al-Manshawi
        6-Yasser Al-Dosari

        sélection aléatoire:${emoji.audio.Shufel}`,
		deafen: 'Veuillez ne pas être sourd pour utiliser cette commande',
		resumenow: 'Veuillez reprendre le Quran pour utiliser cette commande'
	},
	Musahaf: {
		NumberPage: 'Numéro de page',
		NameSurah: 'Nom sourate',
		musahaf: 'quran',
		NumberSurah: 'Numéro de sourate',
		Searcherr:
			"Désolé, il n'y a pas de résultats de recherche correspondants.Veuillez saisir correctement le nom, le numéro ou le numéro de page d'une sourate.",
		ydhd: "Désolé, vous n'avez aucun stockage pour les pages dans les bases de données. ",
		type: 'Type de sourate',
		Surah: 'sourate',
		numberverses: 'versets',
		quailtybad: "`Si la qualité est mauvaise`\n `C'est de discord`",
		Mypage: 'ma page'
	}
};
