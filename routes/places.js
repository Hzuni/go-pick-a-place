const express = require('express');
const AWS = require('aws-sdk');
const idService = require('../services/id-service');
const loggerService = require('../services/logger-service');
const dynamoService = require('../services/dynamo-service');

const logger = loggerService.getLogger();

AWS.config.update({ region: 'us-east-2' });

const setupRouter = (io) => {
  const router = express.Router();
  router.use((req, res, next) => {
    next();
  });

  router.post('/', async (req, res) => {
    let placesListId;
    if (req.session.placesListId) {
      placesListId = req.session.placesListId;
    } else {
      return res.sendStatus(404);
    }
    const { place } = req.body;

    if (!idService.isValidPlacesListId(placesListId)) {
      res.sendStatus(404);
    }
    try {
      await dynamoService.updatePlacesList(placesListId, place);
      const placesList = await dynamoService.getPlacesListById(placesListId);
      let places = []
      Object.values(placesList.Item.places).forEach(place => {
        places.push(place)
      });

      logger.info(`Successfully added place to list: ${placesListId}`);

      res.send({ 'places': places });
    } catch (err) {
      logger.error(`Failed to update list ${placesListId}: ${JSON.stringify(err, null, 2)}`);
    }
  });

  router.post('/list', async (req, res) => {
    try {
      const id = await idService.generateValidPlacesListId();
      logger.info(`Creating new place list with id ${id}`);
      await dynamoService.createPlacesList(id);
      logger.info(`Successfully created list ${id}`);
      req.session.placesListId = id;

      res.send({
        placesListId: id

      });

    } catch (err) {
      logger.error(`Failed to create new places list: ${err}`);
      res.sendStatus(500);
    }
  });

  router.get('/joinByCode', async (req, res) => {
    let placesListId;
    if (req.query.placesListId) {
      placesListId = req.query.placesListId;
    }

    const isValid = await idService.isValidPlacesListId(placesListId);
    if (!isValid) {
      // should turn this into a decorator somehow.
      return res.sendStatus(404);
    }

    if (!req.session?.placesListId) {
      req.session.placesListId = placesListId;
    }

    return res.sendStatus(200);
  });

  router.post('/reset', async (req, res) => {
    let placesListId;
    if (req.session.placesListId) {
      // placesListId = req.session.placesListId;
      req.session.destroy();
    } else {
      return res.sendStatus(404);
    }

    res.send({
      places: [],
      placesListId: ''

    });
  });


  /*
  router.get('/list', async (req, res) => {
    let placesListId;
    if (req.session.placesListId) {
      placesListId = req.session.placesListId;
    } else {
      return res.sendStatus(404);
    }

    const isValid = await idService.isValidPlacesListId(placesListId);
    if (!isValid) {
      // should turn this into a decorator somehow.
      return res.sendStatus(404);
    }

    try {
      const placesList = await dynamoService.getPlacesListById(placesListId);
      let places = []
      Object.values(placesList.Item.places).forEach(place => {
        places.push(place)
      });

      res.send({
        places: places,
        placesListId: placesListId

      });
    } catch (err) {
      logger.info(`Unable to find id ${placesListId}: ${err}`);
    }
  });
  */

  return router;
}

module.exports.setupRouter = setupRouter;