'use strict'
const Joi = require('joi')
const model = require('./model')
const _ = require('lodash')
const randomstring = require('randomstring')
const pkg = require('../package')
const $ = require('./utils')

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
  const userData = this.request.body.userData || {}

  /**
   * define user validation schema
   */
  const schema = Joi.object().keys({
    username: Joi.string().min(2).max(20).required(),
    password: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required()
  })

  /**
   * validate userData
   */
  const ret = Joi.validate(userData, schema)
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
  const userData = this.request.body.userData || {}

  /**
   * define user validation schema
   */
  const schema = Joi.object().keys({
    account: Joi.string().min(2).max(20).required(), // username or email
    password: Joi.string().min(6).max(20).required()
  })

  /**
   * validate userData
   */
  const ret = Joi.validate(userData, schema)
  if (ret.error) {
    this.body = ret
    return
  }

  /**
   * Query user
   */
  const user = yield model.login(userData)
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

api.addLink = function* () {
  const linkData = this.request.body.linkData
  const apiKey = this.request.body.apiKey

  /**
   * Validate API key
   */
  if (!apiKey) {
    this.body = $.requireAPIKey()
    return
  }

  /**
   * Query curruent user
   */
  const currentUser = yield model.getUser(apiKey)
  if (!currentUser) {
    this.body = {
      error: {
        name: 'AuthError',
        message: 'API Key is invalid'
      }
    }
    return
  }

  /**
   * Generate random hash
   */
  linkData.type = linkData.type || 'string'
  if (!_.includes(['string', 'number'], linkData.type)) {
    this.body = {
      error: {
        name: 'ValidationError',
        message: 'Unsupported URL hash type'
      }
    }
    return
  }
  const hashType = {
    string: 'alphabetic',
    number: 'numeric',
    readable: true
  }
  linkData.hash = randomstring.generate({
    length: 5,
    capitalization: 'lowercase',
    charset: hashType[linkData.type]
  })

  /**
   * define link validation schema
   */
  const schema = Joi.object().keys({
    url: Joi.string().uri().required(),
    hash: Joi.string().min(2).max(20).required(),
    type: Joi.string().required()
  })

  /**
   * validate userData
   */
  const ret = Joi.validate(linkData, schema)
  if (ret.error) {
    this.body = ret
    return
  }

  /**
   * Inset link to database
   */
  ret.link = yield model.addLink(ret.value, currentUser._id)

  currentUser._id = undefined
  currentUser.apiKey = undefined
  currentUser.password = undefined
  currentUser.email = undefined

  ret.link.user = currentUser
  this.body = ret
}
