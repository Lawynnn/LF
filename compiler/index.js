const fnParser = require("./functions");

function parseSnowflake(id) { return `[${id}]`}  

/**
 * @typedef compileReturn
 * @property {number[]} deniedIds - Multiplied ids in same code
 * @property {object} data - Data array
 * @property {string} code - Compiled code
 * @property {string} old - Decompiled code
 */
/**
 * 
 * @param {string} code 
 * @returns {compileReturn}
 */
function Compile(code) {
    const collection = new Map();
    let deniedIds = []
    let compiled = code;

    for(const after of code.split("%").slice(1).reverse()) {
        let functions = Object.keys(fnParser()).sort((x, y) => y.length - x.length);
        let regex = new RegExp(`${functions.map(f => `\\${f}`).join("|")}`, "g")
        
        const fns = ("%" + after).match(regex);
        if(!fns)
            continue;

        const snowflake = Math.floor(Math.random() * 1000000000);
        const fn = fnParser()[fns[0]];
        if(!fn)
            continue;

        const r = compiled.split(fn.name).length - 1 
    
        const afterFunc = compiled.split(fn.name)[r];
        if (fn.brackets && !fn.optional && !afterFunc.includes(")")) throw new Error(`${afterFunc.slice(0,15)}...\n^^^^ Missing ) after argument list`);
        
        if (fn.brackets && afterFunc[0] === "(") {
            const inside = afterFunc.slice(1).split(")")[0]
            
            collection.set(snowflake, {
                id: snowflake,
                func: fn,
                inside,
                total: `${fn.name}(${inside})`,
                fields: []
            })
            
            compiled = compiled.replaceLast(`${fn.name}(${inside})`, parseSnowflake(snowflake)) 
        } else {
            collection.set(snowflake, {
                id: snowflake,
                func: fn,
                total: fn.name, 
                fields: []
            })
            
            compiled = compiled.replaceLast(fn.name, parseSnowflake(snowflake))
        }
    }
    
    const compiledArray = [];
    for(const val of Array.from(collection).reverse()) {
        if(deniedIds.includes(val[0])) {
            if(typeof val[1].inside !== "undefined") {
                const fields = Array.from(collection).filter(f => val[1].inside.includes(parseSnowflake(f[0])))
                deniedIds = [...deniedIds, ...fields.map(f => f[0])];
                for (const field of fields) {
                    const col = collection.get(field[0])
                    col.belongsTo = val[0] 
                    collection.set(field[0], col) 
                }
                
                val.fields = fields 
            }

            continue;
        }
        if (typeof val[1].inside !== "undefined") {
            const fields = Array.from(collection).filter(f => val[1].inside.includes(parseSnowflake(f[0])))
            
            for (const field of fields) {
                deniedIds.push(field[0]);
                const col = collection.get(field[0])
                col.belongsTo = val[0] 
                collection.set(field[0], col) 
            }
            
            val[1].fields = fields 
            
            compiledArray.push(val) 
        } else {
            compiledArray.push(val) 
        }
    }

    return {
        deniedIds,
        data: compiledArray,
        code: compiled,
        old: code 
    }
}

String.prototype.replaceLast = function (what, replacement) {
    let pcs = this.split(what);
    let lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};

Object.prototype.format = function(id, data) {
    return {
        id: parseSnowflake(id),
        with: data,
    }
}

Object.prototype.resolveAll = async function() {
    let text = this.value.inside
    if(!this.value.fields) return text;
    for (let val of this.value.fields) {
        val = val[1];
        let data = Object.assign(Object.create(this), this)
        data.value = val 
        const replacer = await val.func.execute(data, true)
        if (!replacer) return undefined
        text = text.replace(parseSnowflake(val.id), replacer.with)
    } 
    
    return text
}

module.exports = Compile;
