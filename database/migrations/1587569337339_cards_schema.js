'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments()
      table.enu('type', [ 'latest', 'all', 'genre' ]).notNullable()
      table
        .integer('genre_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('genres')
      table.string('title', 100).notNullable()
      table.text('description', 'TINYTEXT')
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
