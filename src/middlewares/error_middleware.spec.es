import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
chai.use(sinonChai)
const expect = chai.expect

import error_middleware from './error_middleware'

describe('ErrorMiddleware', () => {
  it('catches ValidationError and responds with 422', async () => {
    const req = {}
    const handler = async (req) => {
      const error = new Error()
      error.name = 'ValidationError'
      error.isJoi = true
      error.details = [
        {message: 'a'},
        {message: 'b'}
      ]
      throw error
    }
    const res = await error_middleware(handler)(req)
    expect(res.status).to.equal(422)
    expect(res.headers).to.deep.equal({'Content-Type': 'application/json; charset=utf-8'})
    expect(res.body).to.equal('{"errors":["a","b"]}')
  })

  it('does not catch other errors', async () => {
    const req = {}
    const handler = async (req) => { throw new Error() }

    try {
      await error_middleware(handler)(req)
      expect(true).to.equal(false) // ensure this isn't executed
    } catch (e) {
      expect(e.name).to.equals('Error')
    }
  })
})
