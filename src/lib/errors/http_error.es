export default class HttpError {
  constructor(message) {
    this.status = 400
    this.headers = {}
    this.message = message
  }

  body() {
    return {errors: [this.message]}
  }
}
