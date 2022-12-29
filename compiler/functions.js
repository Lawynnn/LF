const fs = require("node:fs");

module.exports = () => {
    const fns = {};
    for(const file of fs.readdirSync(`${__dirname}/../functions/`)) {
        const fn = require(`${__dirname}/../functions/${file}`);
        if(fn.disabled) continue;

        fns[fn.name] = fn;
    }
    return fns;
};