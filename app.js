require('dotenv').config(); // read .env files
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const place = require('./routes/place.js');
const loggerService = require('./services/logger-service.js');



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
  done();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


if (env === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  /* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  */
}

app.use('/api/place', place);
logger.info(`Running in mode ${env}`);

module.exports = app;
