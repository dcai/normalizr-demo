const { schema } = require('normalizr');
const { get } = require('lodash');

const counterPartyConnectionTypes = new schema.Entity(
  'counterPartyConnections',
  {},
  {
    idAttribute: (data) => {
      const {
        counterPartyId: { id },
      } = data;
      return id;
    },
  },
);

const getCurrentPage = (paging) => {
  let currentPage;
  const nextPageKeyInt = parseInt(get(paging, 'nextPageKey', -1), 10);
  const previousPageKeyInt = parseInt(get(paging, 'previousPageKey', -1), 10);
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
  'paging',
  {},
  {
    idAttribute: (paging) => getCurrentPage(paging),
    processStrategy: (paging) => {
      const result = {
        id: getCurrentPage(paging),
        total: Math.ceil(paging.count / paging.pageSize),
        pageSize: paging.pageSize,
        count: paging.count,
      };
      return result;
    },
  },
);

const counterPartySchemaArray = new schema.Array(counterPartyConnectionTypes);
const counterPartyConnectionTypesSchema = new schema.Entity('parentj', {});

module.exports = {
  counterPartyConnections: [counterPartyConnectionTypes],
  paging: paging,
};
