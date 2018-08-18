import {defaults} from 'spirit-common'

import mongodb_middleware from './middlewares/mongodb_middleware'
import error_middleware from './middlewares/error_middleware'

const spirit_defaults = defaults("api", {
  log: false,
  proxy: false,
  ifmod: false,
  body: {
    json: { strict: true },
    urlencoded: { extended: true },
    text: false
  }
})


export default [
  spirit_defaults,
  mongodb_middleware,
  error_middleware
]
