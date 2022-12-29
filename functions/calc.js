const LFFunction = require("../structures/LFFunction");
let basicMath = require('advanced-calculator')

module.exports = new LFFunction()
    .setName("%calc")
    .setBrackets(true)
    .onExecute(async (data) => {
        const { value } = data;
        value.inside = await data.resolveAll();
        if (!value.inside) return undefined;
        
        try {
            return data.format(value.id, basicMath.evaluate(value.inside) || undefined);
        }
        catch(e) {
            return data.format(value.id, "invalid expression");
        }
        
    })
    .build();
