import _ from 'underscore'
import spirit from 'spirit'
const response = spirit.node.response

/**
 * Exports exception handler as middleware.
 *
 * @export handler which handles ValidationErrors from Joi. The exception will
 * be converted in a HTTP response with status code 422 and body containing `{errors: <validation_error.details.message>}`
 */
export default (handler) => {
  return (req) => {
    return handler(req)
      .catch((error) => {
        if (error.name === "ValidationError") {
          const messages = _.map(error.details, (detail) => detail.message)

          return response({
            status: 422,
            headers: {},
            body: {errors: messages}
          }).type('json')
        } else {
          throw error
        }
      })
  }
}
