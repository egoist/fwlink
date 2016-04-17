'use strict'
const Joi = require('joi')
const model = require('./model')
const pkg = require('../package')

const api = module.exports = {}

/**
 * API index
 * Log some app info
 */
api.index = function* () {
  this.body = {
    name: pkg.name,
    version: pkg.version
  }
}

/**
 * List all users
 */
api.users = function* () {
  const users = yield model.allUsers()
  this.body = {
    error: null,
    users
  }
}

/**
 * Sign up
 */
api.signup = function* (next) {
  const userdata = this.request.body.userdata || {}

  /**
   * define user validation schema
   */
  const schema = Joi.object().keys({
    username: Joi.string().min(2).max(20).required(),
    password: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required()
  })

  /**
   * validate userdata
   */
  const ret = Joi.validate(userdata, schema)
  if (ret.error) {
    this.body = ret
    return
  }

  /**
   * Check if the user already exists
   * By username and email
   */
  const exists = yield model.userExists(ret.value)
  if (exists) {
    this.body = {
      error: {
        name: 'AuthError',
        message: 'User exists'
      },
      value: ret.value
    }
    return
  }

  /**
   * Insert user into database
   */
  ret.user = yield model.createUser(ret.value)

  /**
   * Success
   */
  this.body = ret
}

/**
 * Signin
 */
api.signin = function* () {
  const userdata = this.request.body.userdata

  /**
   * define user validation schema
   */
  const schema = Joi.object().keys({
    account: Joi.string().min(2).max(20).required(), // username or email
    password: Joi.string().min(6).max(20).required()
  })

  /**
   * validate userdata
   */
  const ret = Joi.validate(userdata, schema)
  if (ret.error) {
    this.body = ret
    return
  }

  /**
   * Query user
   */
  const user = yield model.login(userdata)
  if (user) {
    this.body = {
      error: null,
      value: ret.value,
      user
    }
  } else {
    this.body = {
      error: {
        name: 'AuthError',
        message: 'User not found in database, ensure you entered the correct password'
      },
      value: ret.value
    }
  }
}
