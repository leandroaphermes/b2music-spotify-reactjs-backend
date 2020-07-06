'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ForbiddenException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = ForbiddenException
