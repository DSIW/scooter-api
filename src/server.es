import http from 'http'

import config from './config'
import app from './app'

const server = http.createServer(app)
server.listen(config.port, () => {
  console.log(`Listening on port ${server.address().port}...`);
})
