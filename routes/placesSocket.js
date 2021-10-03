const dynamoService = require('../services/dynamo-service');
const loggerService = require('../services/logger-service');

const logger = loggerService.getLogger();

const initializeSocket = async (socket) => {
    logger.info('Frontend successfully connnected through web socket')
    let placesListId = socket.handshake.session.placesListId
    const placesList = await dynamoService.getPlacesListById(placesListId);
    let places = []
    Object.values(placesList.Item.places).forEach(place => {
      places.push(place)
    });
    socket.emit(places)
}

module.exports.initializeSocket = initializeSocket;