'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardPlaylistSchema extends Schema {
  up () {
    this.create('card_playlists', (table) => {
      table
        .integer('card_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cards')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('playlist_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('playlists')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('card_playlists')
  }
}

module.exports = CardUserPlaylistSchema
