const EventEmitter = require("events");
const Discord = require("discord.js");
const Compiler = require("../compiler");

/**
 * @typedef {Object} LFBotOptions
 * @property {string} token
 * @property {Discord.BitFieldResolvable<Discord.GatewayIntentsString, number>} intents
 */

/**
 * @typedef {Object} messageOptions
 * @property {boolean} allowBots - If is false check for author is a bot
 */


class LFBot extends EventEmitter {
    /**
     *
     * @param {LFBotOptions} options
     */
    constructor(options) {
        super();
        if(!options) options = {};
        this.options = options;
        this.client = new Discord.Client({
            ...options,
            intents: options.intents || [
                "DirectMessages",
                "GuildBans",
                "GuildMembers",
                "GuildInvites",
                "Guilds",
                "MessageContent",
                "GuildMessages",
            ],
        });
        this.commands = new Map();
    }

    /**
     * @callback messageHandlerCallback
     * @param {Discord.Message} message
     * @param {Map<string, string>} command
     * @param {string} args
     * @param {string} code
    */
    /** 
     * @param {messageHandlerCallback} cb 
     * @param {messageOptions} options 
     */
    message(options = {}, cb) {
        this.client.on("messageCreate", (message) => {
            if(message.author.bot && !options.allowBots) {
                return;
            }
            
            let args = message.content.trim().split(/ +/g);
            let command = args[0];
            this.commands.forEach((code, cmd) => {
                if(command === cmd) {
                    cb(message, cmd, args.slice(1), code);
                }
                
            })
            
        })        
    }

    ready(cb) {
        this.client.on("ready", () => {
            cb();
        })
    }

    /**
     * @typedef {Object} commandOptions
     * @property {string} name
     * @property {string} code
     */
    /**
     * 
     * @param {commandOptions} options 
     */
    command(options) {
        this.commands.set(options.name, options.code);
    }

    /**
     * Discord bot token - https://discord.com/developers
     * @param {string} token 
     */
    login(token = null) {
        if(!token) token = this.options.token;
        
        this.client.login(token);
        return this;
    }
}

module.exports = LFBot;
