'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrackHasAuthorsSchema extends Schema {
  up () {
    this.create('track_has_authors', (table) => {
      table
        .integer('track_id')
        .primary()
        .unsigned()
        .references('id')
        .inTable('tracks')
        .notNullable()
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('authors')
        .notNullable()
    })
  }

  down () {
    this.drop('track_has_authors')
  }
}

module.exports = TrackHasAuthorsSchema
