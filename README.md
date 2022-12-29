#LFBOT Example
```js
const LF = require("./LF");

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
