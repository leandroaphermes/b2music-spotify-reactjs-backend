'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ConflictException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = ConflictException
