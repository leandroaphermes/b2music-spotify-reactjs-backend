'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlaylistHistoriesSchema extends Schema {
  up () {
    this.create('playlist_histories', (table) => {
      table.increments()
      table
        .integer('playlist_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('playlists')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('album_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('albums')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('action', 30)
      table.timestamps()
    })
  }

  down () {
    this.drop('playlist_histories')
  }
}

module.exports = PlaylistHistoriesSchema
