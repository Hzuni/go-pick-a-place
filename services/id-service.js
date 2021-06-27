const loggerService = require('./logger-service');
const dynamoService = require('./dynamo-service');

const logger = loggerService.getLogger();

const generateId = () => {
  let code = '';
  while (code.length < 6) {
    code = Math.random().toString(36).substring(2, 8);
  }
  return code;
};

const generateValidPlacesListId = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const id = generateId();
    // eslint-disable-next-line no-await-in-loop
    const data = await dynamoService.getPlacesListById(id);
    if (!('item' in data)) {
      return id;
    }
  }
};

const isValidPlacesListId = async (id) => {
  let isValid = false;
  if (id) {
    const data = await dynamoService.getPlacesListById(id);
    isValid = ('Item' in data);
  }
  return isValid;
};

module.exports = { generateValidPlacesListId, isValidPlacesListId };
