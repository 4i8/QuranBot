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

[ Go to Arabic Version || الذهاب لنسخة العربية](README.ar.md)

## Considering

-   The community can **contribute** to making improvements and adding new features.
-   **The project is not for profit** ⚠
    -   It is never allowed to sell this bot and you will be legally prosecuted.

## Installation

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

## Run Locally

```bash
	npm run start
```

## Commands List

| Command     | Description                                                          | Usage \| Examples                                    | Additional                                                                                                                                                   |
| ----------- | -------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| /play       | Play The Quran in a voice channel with more than 130 Reader[Reciter] | /play "Ahmad Al-Hawashi" Al-Baqara                   | It supports the search feature so that you write the name of the surah, the reciter, the surah number, or the reciter’s number, and it will give you options |
| /pause      | Pause the Recitation.                                                | /pause                                               |                                                                                                                                                              |
| /resume     | Resume the Recitation.                                               | /resume                                              |                                                                                                                                                              |
| /volume     | Adjust the volume with range (10-150)                                | /volume 55<br>/volume 88                             |                                                                                                                                                              |
| /nowplaying | Display information about what is playing now.                       | /nowplaying                                          |                                                                                                                                                              |
| /queue      | Display the queue                                                    | /queue                                               |                                                                                                                                                              |
| /loop       | Toggle the loop mode (On/Off)                                        | /loop                                                |                                                                                                                                                              |
| /seek       | Jump to a specific time in a play track.                             | /seek 2:30:10                                        |                                                                                                                                                              |
| /skip       | Skip to the next item in the queue                                   | /skip                                                |                                                                                                                                                              |
| /stop       | Clear the queue and stops the Recitation.                            | /stop                                                |                                                                                                                                                              |
| /qasas      | Plays the stories of the prophets.                                   | /qasas ما قبل خلق آدم عليه السلام                    | The voice of Nabil Al-Awadi and Tariq Al-Suwaidan in high quality                                                                                            |
| /quran      | Display and Browse the Pages of the Holy Quran.                      | /quran <surah\|page>                                 |                                                                                                                                                              |
| /azkar      | Adjust the Azkar system settings.                                    | /azkar <text-channnel> <periodic-time> <embed-color> | Azkar system: sends Azkar in text channel once in while.                                                                                                     |
| /khutma     | Adjust the Khutma system settings.                                   | /khutma <text-channel> <periodic-time> <embed-color> |                                                                                                                                                              |
| /language   | Change the language of the bot.                                      | /language <العربية\|English\|French>                 |                                                                                                                                                              |
| /prayer     | Adjust the settings of the Prayer Reminder.                          | /prayer <text-channel> <country> <mention>           |                                                                                                                                                              |
| /reset      | Reset the chat(text channel) of Azkar, Khutma, and Prayer Systems.   | /reset                                               |                      
| /recovery      | Activate the recovery system in case the bot is restarted   | /recovery                                               |                                                                                                                                           |

## Developers

-   [@Arth(4i8)](https://github.com/4i8)
-   [@albatranomar](https://github.com/albatranomar)

## License

[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)

## Contributing

Contributions are always welcome!<br>
See `contributing.md` for ways to get started.<br>
Please adhere to this project's [`code of conduct`](https://github.com/4i8/QuranBot/blob/master/CODE_OF_CONDUCT.md).
