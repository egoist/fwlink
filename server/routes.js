'use strict'
const model = require('./model')

const routes = module.exports = {}

routes.linkId = function* () {
  const id = this.params.id
  const url = yield model.getURLByHash(id)
  if (!url) {
    this.body = 'not found'
    this.throw(404)
    return
  }
  this.redirect(url)
}
