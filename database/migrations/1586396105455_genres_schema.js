'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GenresSchema extends Schema {
  up () {
    this.create('genres', (table) => {
      table.increments()
      table.string('name', 50).unique()
      table.text('description', 'TINYTEXT')
      table.string('url', 50).unique().notNullable()
      table.string('color', 8).defaultTo('ffebcd')
      table.timestamps()
    })
  }

  down () {
    this.drop('genres')
  }
}

module.exports = GenresSchema
