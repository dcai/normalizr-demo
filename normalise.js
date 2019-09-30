const { normalize } = require("normalizr");

const normaliseJson = (json, schema) => {
    let result = null;
    const keys = Object.keys(json);

    if (keys.length === 1 && json.data && typeof json.data === "object") {
        result = normalize(json.data, schema);
    } else {
        result = normalize(json, schema);
    }

    if (Object.keys(result.entities).length === 0) {
        console.error(
            `normaliser has encountered an unexpected empty response is about to polyfill it to fit wdp requirements. 
       please make sure down stream api is returning 204 for empty response according to api guide line`
        );
        const schemaType = schema.constructor.name;
        let entityKey;
        if (schemaType === "ArraySchema") {
            ({
                schema: { key: entityKey }
            } = schema);
        } else if (schemaType === "ObjectSchema") {
            [entityKey] = Object.keys(schema.schema);
        }
        result.entities[entityKey] = [];
    }
    /* eslint-disable */
    for (const entity in result.entities) {
        const resultArray = [];
        const allIds = Object.keys(result.entities[entity]);

        allIds.forEach(id => {
            result.entities[entity][id].id = id;
            resultArray.push(result.entities[entity][id]);
        });

        result.entities[entity] = resultArray;
    }
    /* eslint-enable */

    return result;
};

module.exports = normaliseJson;
