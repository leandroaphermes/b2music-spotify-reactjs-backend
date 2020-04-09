'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlbumsSchema extends Schema {
  up () {
    this.create('albums', (table) => {
      table.increments()
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('authors')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('name', 100).notNullable()
      table.string('photo_url', 255)
      table.date('release').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('albums')
  }
}

module.exports = AlbumsSchema
