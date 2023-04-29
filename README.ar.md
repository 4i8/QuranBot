<div align="center">
  <p>
 <a href="https://discord.com/api/oauth2/authorize?client_id=692060368780001300&permissions=138042273056&scope=bot%20applications.commands"><img  src="https://cdn.discordapp.com/icons/694418750807736330/d6cce554798fdcd441d6b3e487ba116e.webp?size=4096" width="300" alt="Quran" /></a>
  </p>
  </div>

  <p align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=692060368780001300&permissions=138042273056&scope=bot%20applications.commands"><img src="https://img.shields.io/static/v1?label=Invite%20Me&message=Add Bot&plastic&color=5865F2&logo=discord&style=for-the-badge"></a>
   <a href="https://discord.gg/3rZjSyS"><img src="https://img.shields.io/discord/694418750807736330?https://img.shields.io/static/v1?text=f&style=for-the-badge&logo=discord&logoColor=fff" alt="Discord server" /></a>
    <a href="LICENSE">
        <img src="https://img.shields.io/github/license/4i8/quranbot?label=License&style=for-the-badge">
    </a>
    <a href="https://github.com/4i8/quranbot/stargazers">
        <img src="https://img.shields.io/github/stars/4i8/quranbot?label=Stars&style=for-the-badge">
    </a>
    <a href="https://github.com/4i8/quranbot/releases/latest">
        <img src="https://img.shields.io/github/v/release/4i8/quranbot?label=Latest%20Version&style=for-the-badge">
    </a>
    <a href="https://github.com/4i8/quranbot/commit/master">
        <img src="https://img.shields.io/github/last-commit/4i8/quranbot?label=Last%20Update&style=for-the-badge">
    </a>
    <img src="https://img.shields.io/github/languages/code-size/4i8/quranbot?label=Size&style=for-the-badge">
    <a href="https://github.com/4i8/quranbot/issues">
        <img src="https://img.shields.io/github/issues/4i8/quranbot?label=Issues&style=for-the-badge">
    </a>
</p>

[ Go to English Version || الذهاب لنسخة الإنجليزية](README.md)

## الأخذ بعين الإعتبار

-   يمكن للمجتمع أن **يساهم** في إجراء تحسينات وإضافة ميزات جديدة.
-   **المشروع ليس من أجل الربح** ⚠
    -   لا يُسمح أبدًا ببيع هذا البوت وستتم مقاضاتك قانونيًا.

## التثبيت

1. Clone QuranBot with `git clone`
    ```bash
    	git clone https://github.com/4i8/quranbot.git
    	cd quranbot
    ```
2. Install Packages
    ```bash
    	npm install
    ```

#### **Rename `src/config.example.json` to `src/config.json`**

3. Add your Tokens to `src/config.json`
    ```json
    {
    	"BOT_TOKEN": "<REQUIRD>",
    	"TEST_BOT_TOKEN": "<REQUIRD>",
    	"Mongo_DB": "<REQUIRD>"
    }
    ```

## تشغيل محليًا

```bash
	npm run start
```

## قائمة الأوامر

| الأمر       | الوصف                                                             | الإستخدام \| أمثلة                                         | إضافي                                                                                            |
| ----------- | ----------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| /play       | قم بتشغيل القرآن في قناة صوتية بأكثر من 130 قارئ                  | /play "Ahmad Al-Hawashi" Al-Baqara                         | يدعم خاصية البحث بحيث تقوم بكتابة اسم السورة أو المقرئ أو رقم السورة أو رقم المقرئ ويعطيك خيارات |
| /pause      | تعليق التلاوة.                                                    | /pause                                                     |                                                                                                  |
| /resume     | إستئناف التلاوة.                                                  | /resume                                                    |                                                                                                  |
| /volume     | ضبط درجة الصوت في نطاق (10-150)                                   | /volume 55<br>/volume 88                                   |                                                                                                  |
| /nowplaying | عرض معلومات حول ما يتم تشغيله الآن.                               | /nowplaying                                                |                                                                                                  |
| /queue      | عرض قائمة الإنتظار                                                | /queue                                                     |                                                                                                  |
| /loop       | تبديل وضع التكرار (تشغيل / إيقاف)                                 | /loop                                                      |                                                                                                  |
| /seek       | القفز إلى وقت محدد في قائمة التشغيل.                              | /seek 2:30:10                                              |                                                                                                  |
| /skip       | تخطي إلى العنصر التالي في قائمة الانتظار                          | /skip                                                      |                                                                                                  |
| /stop       | مسح قائمة الانتظار ووقف التلاوة.                                  | /stop                                                      |                                                                                                  |
| /qasas      | تشغيل قصص الأنبياء                                                | /qasas ما قبل خلق آدم عليه السلام                          | The voice of Nabil Al-Awadi and Tariq Al-Suwaidan in high quality                                |
| /quran      | عرض وتصفح القرآن الكريم .                                         | /quran <surah\|page>                                       |                                                                                                  |
| /azkar      | ضبط إعدادات نظام الأذكار.                                         | /azkar < text-channnel > < periodic-time > < embed-color > | Azkar system: sends Azkar in text channel once in while.                                         |
| /khutma     | ضبط إعدادات نظام الختمة.                                          | /khutma < text-channel > < periodic-time > < embed-color > |                                                                                                  |
| /language   | تغيير لغة البوت.                                                  | /language <العربية\|English\|French>                       |                                                                                                  |
| /prayer     | ضبط إعدادات منبه الصلاة.                                          | /prayer < text-channel > < country > < mention >           |                                                                                                  |
| /reset      | إعادة ضبط الدردشة (القناة النصية) لأنظمة الأذكار والخطمة والصلاة. | /reset                                                     |
| /recovery      | تفعيل نظام الريكوفري في حالة تم إعادة تشغيل البوت | /recovery                                                     |


## المطورون

-   [@Arth(4i8)](https://github.com/4i8)
-   [@albatranomar](https://github.com/albatranomar)

## رخصة

[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)

## المساهمة

المساهمات دائما موضع ترحيب!<br>
أنظر `contributing.md` لمعرفة طرق البدء.<br>
يرجى الالتزام "[بمدونة قواعد السلوك](https://github.com/4i8/QuranBot/blob/master/CODE_OF_CONDUCT.md)" الخاصة بهذا المشروع.
