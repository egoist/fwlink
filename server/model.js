'use strict'
const mongorito = require('mongorito')
const uuid = require('node-uuid')
const $ = require('./utils')

const Model = mongorito.Model

/**
 * Database config
 * // TODO
 */
const envKey = $.isDev ? 'DEV' : 'PROD'
const database = {
  name: process.env[`FWLINK_DB_NAME_${envKey}`],
  username: process.env[`FWLINK_DB_USERNAME_${envKey}`],
  password: process.env[`FWLINK_DB_PASSWORD_${envKey}`]
}

/**
 * Establish MongoDB connection
 */
mongorito.connect(`localhost/${database.name}`)

/**
 * Expose model methods
 */
const model = module.exports = {}

/**
 * Define schemas
 */
model.User = class User extends Model {}
model.Link = class Link extends Model {}


/**
 * User manipulations
 */
model.allUsers = function* () {
  let users = yield model.User.find()
  // remove private keys
  users = users.map(user => {
    user.unset('password')
    user.unset('email')
    user.unset('apiKey')
    return user.get()
  })
  return users
}

model.createUser = function* (userData) {
  const user = new model.User(userData)
  user.set('apiKey', uuid.v4())
  const createdUser = yield user.save()
  createdUser.unset('_id')
  createdUser.unset('password')
  return createdUser.get()
}

model.login = function* (userData) {
  const user = yield model.User.or({
    username: userData.account
  }, {
    email: userData.account
  }).findOne({password: userData.password})
  return user && user.get()
}

model.userExists = function* (userData) {
  const user = yield model.User.or({
    username: userData.username,
  }, {
    email: userData.email
  }).findOne()
  return user
}

model.getUser = function* (apiKey) {
  const user = yield model.User.findOne({apiKey})
  return user && user.get()
}

/**
 * Link manipulations
 */
model.addLink = function* (linkData, uid) {
  const link = new model.Link({
    url: linkData.url,
    hash: linkData.hash
  })
  link.set('user', uid)
  const savedLink = yield link.save()
  savedLink.unset('_id')
  return savedLink.get()
}

model.getURLByHash = function* (hash) {
  const link = yield model.Link.findOne({hash})
  return link && link.get('url')
}
