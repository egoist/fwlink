'use strict'
const _ = require('lodash')

const $ = module.exports = {}

$.isDev = process.env.NODE_ENV === 'development'

$.requireAPIKey = () => ({
  error: {
    name: 'AuthError',
    message: 'No API Key provided'
  }
})
