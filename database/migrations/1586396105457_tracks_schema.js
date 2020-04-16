'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TracksSchema extends Schema {
  up () {
    this.create('tracks', (table) => {
      table.increments()
      table.string('name', 100)
      table
        .integer('album_id')
        .unsigned()
        .references('id')
        .inTable('albums')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('src')
      table.integer('duration').notNullable()
      table.integer('playcount').unsigned().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('tracks')
  }
}

module.exports = TracksSchema
