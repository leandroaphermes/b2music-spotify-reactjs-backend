'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlaylistHistorysSchema extends Schema {
  up () {
    this.create('playlist_historys', (table) => {
      table.increments()
      table
        .integer('playlist_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('playlists')
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
      
      table.timestamps()
    })
  }

  down () {
    this.drop('playlist_historys')
  }
}

module.exports = PlaylistHistorysSchema
