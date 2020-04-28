'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments()
      table.string('title', 100).notNullable()
      table.text('description', 'TINYTEXT')
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
