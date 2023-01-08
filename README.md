<div align="center">
  <img src="https://img.shields.io/github/languages/top/Lawynnn/LF?style=flat-square"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=LF&metric=ncloc"/>
  <img src="https://img.shields.io/github/stars/Lawynnn/LF?color=5ac18e&label=Stars&style=flat-square"/>
  <img src="https://img.shields.io/bitbucket/issues-raw/Lawynnn/LF?style=flat-square">
</div>

# INSTALLATION

Install yarn (only if u dont have already)
`npm i -g yarn`

Download libraries
`yarn add https://github.com/Lawynnn/LF.git discord.js advanced-calculator`

# LFBOT Example

```js
const LF = require("LF");

const bot = new LF.Bot();

bot.ready(() => {
  console.log(`${bot.client.user.tag} is ready!`);
});

bot.command({ name: `!mycommand`, code: `Here is your operation: **%calc(%arg)**` });

bot.message({ allowBots: false }, async (message, command, args, code) => {
  let data = await LF.Parse(LF.Compiler(code), message, command, args);
  await message.channel.send(data.container.code);
});

bot.login("your token");
```
