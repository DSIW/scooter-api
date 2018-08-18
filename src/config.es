export default {
  mongodb_ip: process.env.MONGODB_IP || '127.0.0.1',
  mongodb_port: process.env.MONGODB_PORT || 27017,
  mongodb_database: process.env.MONGODB_DATABASE || 'scooter-api',
  mongodb_collection: process.env.MONGODB_COLLECTION || 'positions',
  port: process.env.PORT || 3000
}
