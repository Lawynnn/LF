const Discord = require("discord.js");


/**
 * @typedef {Object} LFFunctionValue
 * @property {number} id
 * @property {string} inside
 * @property {string} total
 * @property {string[]} fields  
 */

/**
 * @typedef {Object} LFFunctionExecuteParam
 * @property {LFFunctionValue} value
 * @property {Discord.Channel} channel
 * @property {Discord.Message} message
 * @property {Discord.Guild} guild
 * @property {string[]} args
 * @property {string} command
 */

/**
 * @callback LFFunctionExecuteCallback
 * @param {LFFunctionExecuteParam} data
 */

/**
 * @typedef {Object} LFFunctionOptions
 * @property {string} name - Example: %sum
 * @property {boolean} disabled
 * @property {boolean} brackets
 * @property {boolean} optional
 * @property {LFFunctionExecuteCallback} execute
 */


class LFFunction {
    /**
     * @param {LFFunctionOptions} options
     */
    constructor(options) {
        if(!options) options = {};
        this.name = options.name;
        this.brackets = options.brackets || false;
        this.disabled = options.disabled || false;
        this.optional = options.optional || false;
        this.execute = options.execute;
    }

    /**
     * This will build the function into a JSON component
     * @returns BUILDED FUNCTION
     */
    build() {
        return {
            name: this.name,
            brackets: this.brackets,
            disabled: this.disabled,
            optional: this.optional,
            execute: this.execute
        }
    }

    /**
     * This will return a string that will replace into compiler
     * @param {LFFunctionExecuteCallback} cb 
     */
    onExecute(cb) {
        if(typeof cb !== "function") throw new Error("onExecute function argument one needs to be type of a function");
        this.execute = cb;
        return this;
    } 

    setOptional(c) {
        if(typeof c !== "boolean") throw new Error("setOptional function argument one needs to be type of a boolean");
        this.optional = c;
        return this;
    }

    setDisabled(c) {
        if(typeof c !== "boolean") throw new Error("setDisabled function argument one needs to be type of a boolean");
        this.disabled = c;
        return this;
    }

    setName(name) {
        if(typeof name !== "string") throw new Error("setName function argument one needs to be type of a string");
        this.name = name;
        return this;
    }

    setBrackets(c) {
        if(typeof c !== "boolean") throw new Error("setBrackets function argument one needs to be type of a boolean");
        this.brackets = c;
        return this;
    }
}

module.exports = LFFunction;