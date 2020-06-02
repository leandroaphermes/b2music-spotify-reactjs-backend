'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowersSchema extends Schema {
  up () {
    this.create('followers', (table) => {
      table.increments()
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
        .integer('track_id')
        .nullable()
        .unsigned()
        .defaultTo(null)
        .references('id')
        .inTable('tracks')
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

      table.enu('type', [ 'album', 'author', 'playlist', 'track' ])

      table.timestamps()
    })
  }

  down () {
    this.drop('followers')
  }
}

module.exports = FollowersSchema
