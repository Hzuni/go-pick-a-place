const placesRouter = require('./places');
const placesSocket = require('./placesSocket');
const loggerService = require('../services/logger-service');
const dynamoService = require('../services/dynamo-service');


module.exports.placesRouter = placesRouter
module.exports.placesSocket = placesSocket;
