const Bot = require("./structures/LFBot");
const Function = require("./structures/LFFunction");
const Compiler = require("./compiler");

/**
 * 
 * @param {Compiler.compileReturn} compiled 
 * @param {import("discord.js").Message} message 
 * @param {string} command 
 * @param {string} args 
 * @returns 
 */
async function Parse(compiled, message, command, args) {
    let data = {};
    data.channel = message.channel;
    data.container = { array: compiled.data, code: compiled.code };
    data.args = args;
    data.command = command;
    data.guild = message.guild;
    data.message = message;
    for(let val of data.container.array) {
        val = val[1];
        data.value = val;
        let res = await val.func.execute(data);
        if(!res) {
            console.log("no response for", val.func.name);
            continue;
        }
        data.container.code = data.container.code.replace(res.id, res.with);
        
    }
    return data;
}

module.exports = {Bot, Compiler, Function, Parse};