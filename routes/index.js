const places = require('./places.js');

const setupRoutes = (app, io) => {

  io.on("connection", function (socket) {
    socket.join(socket.session.placesListId);

  });

  app.use('/api/place', places.setupRouter(io));

}
module.exports.setupRoutes = setupRoutes;
