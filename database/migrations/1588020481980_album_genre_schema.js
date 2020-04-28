'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlbumGenreSchema extends Schema {
  up () {
    this.create('album_genre', (table) => {
      table
        .integer('album_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('albums')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('genre_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('genres')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('album_genre')
  }
}

module.exports = AlbumGenreSchema
