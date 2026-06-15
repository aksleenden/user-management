const crypto = require('crypto');

function getUniqIdValue() {
  return crypto.randomBytes(24).toString('hex');
}

module.exports = { getUniqIdValue };
