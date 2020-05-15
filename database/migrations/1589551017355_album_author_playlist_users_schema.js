'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlbumAuthorPlaylistUsersSchema extends Schema {
  up () {
    this.create('album_author_playlist_users', (table) => {
      table
        .integer('album_id')
        .nullable()
        .unsigned()
        .defaultTo(null)
        .references('id')
        .inTable('albums')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('author_id')
        .nullable()
        .unsigned()
        .defaultTo(null)
        .references('id')
        .inTable('authors')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('playlist_id')
        .nullable()
        .unsigned()
        .defaultTo(null)
        .references('id')
        .inTable('playlists')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.enu('type', [ 'album', 'author', 'playlist' ])

      table.timestamps()
    })
  }

  down () {
    this.drop('album_author_playlist_users')
  }
}

module.exports = AlbumAuthorPlaylistUsersSchema
