const winston = require('winston');

let logger = null;

const getLogger = () => {
  if (logger != null) {
    return logger;
  }
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
    ],
  });
  return logger;
};

module.exports = { getLogger };
