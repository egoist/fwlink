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
mongorito.connect('localhost/fwlink_dev')

/**
 * Expose model methods
 */
const model = module.exports = {}

/**
 * Define User schema
 */
model.User = class User extends Model {}


/**
 * manipulations
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

model.createUser = function* (userdata) {
  const user = new model.User(userdata)
  user.set('apiKey', uuid.v4())
  const createdUser = yield user.save()
  createdUser.unset('_id')
  createdUser.unset('password')
  return createdUser.get()
}

model.login = function* (userdata) {
  const user = yield model.User.or({
    username: userdata.account
  }, {
    email: userdata.account
  }).findOne({password: userdata.password})
  return user && user.get()
}

model.userExists = function* (userdata) {
  const user = yield model.User.or({
    username: userdata.username,
  }, {
    email: userdata.email
  }).findOne()
  return user
}
