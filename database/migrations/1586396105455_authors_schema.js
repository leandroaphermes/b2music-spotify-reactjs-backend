'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthorsSchema extends Schema {
  up () {
    this.create('authors', (table) => {
      table.increments()
      table.string('name', 100).notNullable()
      table.string('photo_url', 255)
      table.text('bio')
      table.string('site', 255)
      table.string('wikipedia', 255)
      table.string('instagram', 255)
      table.string('twitter', 255)
      table.string('facebook', 255)

      table.timestamps()
    })
  }

  down () {
    this.drop('authors')
  }
}

module.exports = AuthorsSchema
