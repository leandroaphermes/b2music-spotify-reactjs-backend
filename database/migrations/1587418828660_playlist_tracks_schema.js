'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlaylistTrackSchema extends Schema {
  up () {
    this.create('playlist_tracks', (table) => {
      table.increments()
      table
        .integer('playlist_id')
        .unsigned()
        .references('id')
        .inTable('playlists')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('track_id')
        .unsigned()
        .references('id')
        .inTable('tracks')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('playlist_tracks')
  }
}

module.exports = PlaylistTrackSchema
