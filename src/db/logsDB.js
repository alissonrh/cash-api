const conn = require('./connection');

const insert = (log, personId) => conn.execute(
  'INSERT INTO logs (event, timestamp, person_id) VALUES (? ,? , ?)',
  [log.event, log.timestamp, personId],
);

const findByPersonId = (personId) => conn.execute(
  'SELECT id, event, timestamp FROM logs WHERE person_id = ?',
  [personId],
);

module.exports = {
  insert,
  findByPersonId,
};