const { normalize, schema } = require('normalizr');
const counterPartyConnectionTypesSchema = require('./schema');
const normalise = require('./normalise');

const input = {
  data: {
    counterPartyConnections: [
      {
        counterPartyId: {
          id: '1234567',
          idScheme: 'CustomerInternalId',
        },
        businessUnit: 'BBSG',
        connectionType: 'ECID',
        isFundsCustomer: true,
        isCustomerSecuritised: true,
      },
    ],
  },
  paging: {
    count: 72,
    pageSize: 10,
    nextPageKey: '2',
    previousPageKey: '-1',
  },
};

const beforeSendToNormalise = { ...input.data };
beforeSendToNormalise.paging = input.paging;

const normalisedResult = normalise(beforeSendToNormalise, counterPartyConnectionTypesSchema);
console.info(JSON.stringify(normalisedResult));
// res.status(200)
// .json(normalisedResult)
// .end();
