'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthorTrackSchema extends Schema {
  up () {
    this.create('author_track', (table) => {
      table.increments()
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('authors')
        .notNullable()
      table
        .integer('track_id')
        .unsigned()
        .references('id')
        .inTable('tracks')
        .notNullable()
    })
  }

  down () {
    this.drop('author_track')
  }
}

module.exports = AuthorTrackSchema
