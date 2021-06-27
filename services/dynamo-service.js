const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' });

// Create DynamoDB document client
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const table = process.env.PLACES_LIST;

const getPlacesListById = async (id) => {
  const params = {
    TableName: table,
    Key: { id },
  };
  return ddb.get(params).promise();
};

const createPlacesList = (id) => {
  const placesList = {
    id,
    places: {},
  };

  const params = {
    TableName: table,
    Item: placesList,
  };

  return ddb.put(params).promise();
};

const updatePlacesList = async (id, place) => {
  const params = {
    TableName: table,
    Key: { id },
    ExpressionAttributeNames: {
      '#plcs': 'places',
      '#id': place.place_id,
    },
    ExpressionAttributeValues: {
      ':p': place,
    },
    UpdateExpression: 'SET #plcs.#id = if_not_exists(#plcs.#id, :p)',
    ReturnValues: 'UPDATED_NEW',
  };

  return ddb.update(params).promise();
};

module.exports = { getPlacesListById, createPlacesList, updatePlacesList };
