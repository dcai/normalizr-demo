const { schema } = require("normalizr");
const { get } = require("lodash");

const counterPartyConnectionTypes = new schema.Entity(
    "differtnanem",
    {},
    {
        // idAttribute: ({data: counterPartyConnections}) => counterPartyConnections.counterPartyId.id,
        processStrategy: data => {
            console.log("!!!!!!!!!", data.counterPartyConnections);

            const bla = data.counterPartyConnections;
            return { ...data.counterPartyConnections };
            // return {bb: 324234};
            const {
                counterPartyId: { id, idScheme },
                ...rest
            } = data.counterPartyConnections;

            console.log("$#%$#%$#%$#%$#", id, idScheme);
            return {
                id,
                idScheme,
                ...rest
            };
        }
    }
);

const getCurrentPage = paging => {
    let currentPage;
    const nextPageKeyInt = parseInt(get(paging, "nextPageKey", -1), 10);
    const previousPageKeyInt = parseInt(get(paging, "previousPageKey", -1), 10);
    if (nextPageKeyInt === -1 && previousPageKeyInt === -1) {
        currentPage = 1;
    } else if (nextPageKeyInt === -1) {
        currentPage = previousPageKeyInt + 1;
    } else {
        currentPage = nextPageKeyInt - 1;
    }
    return currentPage;
};

const paging = new schema.Entity(
    "paging",
    {},
    {
        idAttribute: paging => getCurrentPage(paging),
        processStrategy: paging => {
            return {
                id: getCurrentPage(paging),
                total: Math.ceil(paging.count / paging.pageSize),
                pageSize: paging.pageSize,
                count: paging.count
            };
        }
    }
);

const counterPartySchemaArray = new schema.Array(counterPartyConnectionTypes);
const counterPartyConnectionTypesSchema = new schema.Entity("parentj", {
    counterPartySchemaArray
    // paging
});

module.exports = counterPartyConnectionTypesSchema;
