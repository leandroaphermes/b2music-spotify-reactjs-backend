'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class BadRequestException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = BadRequestException
