import spirit from 'spirit'

import routes from './routes'
import middlewares from './middlewares'

export default spirit.node.adapter(routes, middlewares)
