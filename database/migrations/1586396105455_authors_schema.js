'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthorsSchema extends Schema {
  up () {
    this.create('authors', (table) => {
      table.increments()
      table.string('name', 100).notNullable()
      table.string('photo_url')
      table.text('bio')
      table.string('site')
      table.string('wikipedia')
      table.string('instagram')
      table.string('twitter')
      table.string('facebook')
      table.timestamps()
    })
  }

  down () {
    this.drop('authors')
  }
}

module.exports = AuthorsSchema
