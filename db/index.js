const mongoose = require('mongoose');
const Payment = require('./Payment');

let cachedDb = null;
async function connect() {
  if (cachedDb) {
    return cachedDb;
  }
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = conn
  return conn;
}

module.exports = {
  connect,
  models: {
    Payment
  }
};