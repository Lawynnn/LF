const LFFunction = require("../structures/LFFunction");

module.exports = new LFFunction().setName("%arg").setBrackets(true).setOptional(true).onExecute(async (data) => {
    const { value, args } = data;
    if(value.inside) {
        value.inside = await data.resolveAll();
        if(!value.inside) return undefined;
        
        return data.format(value.id, args[Number(value.inside) - 1] || "");
    }
    return data.format(value.id, args.join(" "));
    
}).build();