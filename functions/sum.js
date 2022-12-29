const LFFunction = require("../structures/LFFunction");
module.exports = new LFFunction().setName("%sum").setBrackets(true).onExecute(async data => {
    const { value } = data;
    value.inside = await data.resolveAll();
    if(!value.inside) return undefined;
    return data.format(value.id, value.inside.split(";").reduce((x, y) => Number(x) + Number(y), 0));
}).build();