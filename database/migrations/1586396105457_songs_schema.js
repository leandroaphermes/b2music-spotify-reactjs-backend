'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TracksSchema extends Schema {
  up () {
    this.create('tracks', (table) => {
      table.increments()
      table
        .integer('album_id')
        .unsigned()
        .references('id')
        .inTable('albums')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.integer ('playtime')
      table.string('name', 100)
      table.string('url')
      table.timestamps()
    })
  }

  down () {
    this.drop('tracks')
  }
}

module.exports = TracksSchema
