"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class RecordNotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    return response.status(404).json({
      error: "Record is not found. Check other universes."
    });
  }
}

module.exports = RecordNotFoundException;