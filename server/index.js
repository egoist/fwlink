'use strict'
const Path = require('path')
const dotenv = require('dotenv')
const koa = require('koa')
const sendfile = require('koa-sendfile')
const Router = require('koa-router')
const koaBody = require('koa-body')

/**
 * Load environment variables
 */
dotenv.config()

/**
 * Load internal modules
 */
const _ = require('./utils')
const api = require('./api')

/**
 * Create app instance
 */
const app = koa()

/**
 * App router instance
 */
const router = new Router()

/**
 * The APIs
 * And API router instance
 */
const apiRouter = new Router({
  prefix: '/api'
})
apiRouter.get('/', api.index)
apiRouter.get('/users', api.users)
apiRouter.post('/signup', api.signup)
apiRouter.post('/signin', api.signin)

/**
 * Redirect to the real link by id
 */
router.get('/link/:id', function* () {
  this.body = `redirecting to ${this.params.id}...`
})

/**
 * Serve the main Vue app
 */
router.get('*', function* () {
  this.set('Content-Type', 'text/html')
  if (_.isDev) {
    this.body = 'Development index please visit <a href="http://localhost:3711">http://localhost:3711</a>'
  } else {
    yield sendfile(this, Path.join(__dirname, '../build/index.html'))
    if (!this.status) this.throw(404)
  }
})

/**
 * Listen at port 3131
 */
app
  .use(koaBody())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(router.routes())
  .listen(3131, () => {
    console.log(`Listening at http://localhost:3131`)
  })
