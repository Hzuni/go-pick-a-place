require('dotenv').config(); // read .env files
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const routes = require('./routes');
const loggerService = require('./services/logger-service.js');
const sharedSession = require("express-socket.io-session");



const logger = loggerService.getLogger();
const  redisUrl = process.env.REDIS_URL
logger.info(`pick a place starting, attempting to start redis at ${redisUrl}`);
const redisClient = redis.createClient(redisUrl);
const env = process.env.NODE_ENV;

const app = express();

const sess = {
  store: new RedisStore({ client: redisClient }),
  secret: 'injected_env_var',
  resave: false,
  cookie: {},
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

app.use((req, res, done) => {
  logger.info(req.originalUrl);
  // this is middleware you dummy use it for checking out ids
  done();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


if (env === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

const setupRoutes = (io) => {
  io.use(sharedSession(session));
  routes.setupRoutes(app, io);
}


module.exports.app = app;
module.exports.setupRoutes = setupRoutes
