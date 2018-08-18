import config from '../config'
import mongoose from 'mongoose'

let auth = ''
if (config.mongodb_user !== undefined) {
  auth = `${config.mongodb_user}:${config.mongodb_password}@`
}

/**
 * Exports handler function as middleware to prepare redis connection. It sets
 * `req.redis_storage` to the current connected redis storage.
 */
export default (handler) => {
  const connection = mongoose.connect(`mongodb://${auth}${config.mongodb_ip}:${config.mongodb_port}/${config.mongodb_database}`, function (err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
  });

  return (req) => {
    // req.mongodb_connection = connection
    return handler(req)
  }
}
