let config = require('../config.json');
let emoji = config.emojis;

module.exports = {
	Permissions: {
		client: 'يجب أن يكون لدي رتبة لها صلاحيات',
		User: 'يجب أن يكون لديك رتبة لها صلاحيات'
	},
	Prefix: 'البادئة',
	run: 'يوجد امر بالفعل قيد تشغيل ',
	Readers: 'القراء:',
	nulldb: 'لا توجد بيانات',
	Showreaders: 'لإظهار القراء:',
	EXAMPLE: 'مثال:',
	Request: 'طلب',
	prefix: 'البادئة',
	off: 'إيقاف',
	Supportlink: '[الدعم الفني](https://discord.gg/3rZjSyS)',
	talkdev: 'يمكنك التحدث مع المطورين عبر الرابط أعلاه\n\n[الدعم الفني](https://discord.gg/3rZjSyS)',
	occurred: 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى',
	Cooldowns: 'فترات التهدئة',
	invite: `[رابط البوت](${config.Links.invite})`,
	ifhelp: 'إذا كنت تريد المزيد من المعلومات حول أي أمر',
	commandname: 'اسم الأمر',
	error: 'يجب عمل استئناف قبل استخدام هذا الامر',
	very: 'جميع الحقوق محفوظة لفريق بوت القرآن ©',
	paypal: '[رابط التبرع](https://www.paypal.me/QuranTeam)',
	errCountries: 'يرجى التأكد من ادخالك لأسم الدولة او المدينة بشكل الصحيح',
	Admin: {
		// settings //
		status: 'الحالة',
		guildId: 'معرف سيرفر',
		guildName: 'اسم سيرفر',
		guildPrefix: 'بادئة سيرفر',
		Language: 'اللغة',
		Controller: 'المتحكم',
		Command: 'الاوامر',
		guildName: 'اسم سيرفر',
		khatm: 'ختم القرآن الكريم',
		azkar: 'الأذكار',
		voice: 'القناة الصوتية',
		// SetRole //
		mention: 'منشن رول',
		idrole: 'معرف رول',
		NameRole: 'اسم رول',
		rolestatus: 'حالة الرول الآن',
		localrole: 'وقد تم بالفعل تحديد هذا الرول.',
		// Prefix //
		prefixlength: 'يجب أن تكون البادئة الجديدة أقل من حرفين (2)',
		beFOTE: 'هذه البادئة موجودة من قبل',
		Prefix: 'تم تغير البادئة الى',
		//Set-channel//
		Mentionschannel: 'منشن القناة',
		IDchannel: 'معرف القناة',
		Namechannel: 'اسم القناة',
		AredyChannel: 'تم تحديد هذه القناة بالفعل.',
		commandstatusnow: 'حالة الاوامر الآن',
		voicestatusnow: 'حالة القناة الصوتية الآن',
		khatamstatusnow: 'حالة الختم الآن',
		reminderstatusnow: 'حالة تذكير رمضان الآن',
		CountdownRamadan: 'عد تنازلي لشهر رمضان الكريم',
		Doaa: 'دعاء أول يوم في رمضان',
		azkarstatusnow: 'حالة الأذكار الآن',
		//reset//
		truee: 'هل أنت متأكد من هذه العملية؟',
		done: 'في هذه العملية سيتم حذفه',
		notdone: 'لا توجد بيانات لإعادة تعيين',
		reset: 'إعادة ضبط....',
		donereset: 'تم إعادة تعيين الإعدادات بنجاح',
		notdonereset: 'تم إلغاء إعادة تعيين الإعدادات بنجاح'
	},
	audio: {
		notenough: 'قائمة الانتظار غير كافية',
		seekError: 'مدة التقدم تتجاوز مدة القرآن',
		nv: 'لا يمكن التشغيل هنا. يجب أن تكون بداخل هذه القناة الصوتية',
		progressbar: 'شريط التقدم',
		left: 'الوقت المتبقي',
		Plsvoicec: 'يرجى دخول الى قناة صوتية اولاً',
		must: 'الأن يمكنك أستخدام هذا الأمر',
		notlisten: 'يجب أن يكون لديك قائمة انتظار لاستخدام هذا الأمر',
		volnow: 'مستوى الصوت الحالي',
		notnumber: 'هذا ليس رقماً !',
		limitvol: 'الحد لمستوى صوت `10/150`',
		volchange: 'مستوى الصوت تغير الى',
		occurred: 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى',
		stopQuran: 'تم إيقاف القرآن وإزالة قائمة الانتظار',
		skipQuran: 'تم تخطي',
		QuranReders: 'بصوت القارىء',
		resumeFrom: 'تم استئناف القرآن من الآن',
		resumAlready: 'تم استئناف القرآن بالفعل',
		listeningNow: `تستمع الان ${emoji.chevron}`,
		Searcherr: 'عذرا لا توجد نتائج بحث مطابقة يرجى كتابة اسم السورة او رقمها بشكل الصحيح',
		Queue: 'قائمة الانتظار',
		Suratarrangement: 'ترتيب السورة',
		addQueue: 'تم أضافة',
		donePlay: 'تم تشغيل الان',
		a1: 'اسم السورة',
		a2: 'رقم السورة',
		a3: 'كامل ',
		all: 'كامل',
		play: 'play',
		quranPause: 'تم إيقاف القرآن مؤقتًا من الآن',
		alreadyPause: 'القرآن متوقف مؤقتًا بالفعل',
		repeatQuran: 'تكرار',
		Onrepeat: 'مفعل',
		Offrepeat: 'إيقاف',
		Warnrepeat: 'تحذير:\n لا يتم إرسال رسالة التشغيل في كل مرة يتم تشغيل فيها لعدم إزعاج مستخدمي البوت',
		Clearqueue: 'تم مسح قائمة الانتظار',
		endREDERS: 'لقد انتهيت من وقت الاختيار',
		reactionEND: 'يرجى الانتظار حتى يتم الانتهاء من اكتمال الرياكشن',
		TineoutRecat: `يرجى الانتظار حتى يتم الانتهاء من اكتمال الرياكشن\nتنبيه:\n لديك \`15\` ثانية فقط`,
		ReadersEmbed: `
        عبدالباسط عبد الصمد-1
        مشاري العفاسي-2
        فارس عباد-3
        ماهر المعيقلي-4
        محمد المنشاوي-5
        ياسر الدوسري-6

        اختيار عشوائي: ${'emoji.Audio.Shufel'}`,
		deafen: 'يرجى الغاء كتم السماعة للإستخدام هذا الأمر',
		resumenow: 'يرجى استئناف القران لإستخدام هذا الأمر'
	},
	Musahaf: {
		NumberPage: 'رقم الصفحة',
		NameSurah: 'اسم السورة',
		musahaf: 'quran',
		NumberSurah: 'رقم السورة',
		Searcherr: 'عذرا لا توجد نتائج بحث مطابقة يرجى كتابة اسم السورة او رقمها او رقم الصفحة بشكل الصحيح',
		ydhd: 'عذراً لايوجد لديك اي تخزين لصفحات في قواعد البيانات',
		type: 'نوع السورة',
		Surah: 'السورة',
		numberverses: 'عدد الايات',
		quailtybad: 'ان كانت الجودة سيئة فهذا من `الديسكورد`',
		Mypage: 'صفحتي'
	}
};
