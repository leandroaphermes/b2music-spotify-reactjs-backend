'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 32).notNullable().unique()
      table.string('email', 64).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('truename', 100).notNullable()
      table.string('photo_url').defaultTo("")
      table.string('phone', 20).notNullable()
      table.enu('gender', ["F", "M", "O"]).notNullable()
      table.date('birth').notNullable()
      table.string('country', 3).notNullable()
      table.string('province', 3).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
