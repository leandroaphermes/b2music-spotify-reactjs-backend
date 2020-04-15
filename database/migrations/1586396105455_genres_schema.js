'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GenresSchema extends Schema {
  up () {
    this.create('genres', (table) => {
      table.increments()
      table.string('name', 50)
      table.text('description', 'TINYTEXT')
      table.timestamps()
    })
  }

  down () {
    this.drop('genres')
  }
}

module.exports = GenresSchema