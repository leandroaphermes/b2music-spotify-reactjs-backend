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
      table.string('phone', 20).notNullable()
      table.enu('gender', ["F", "M"]).notNullable()
      table.date('birth', 20).notNullable()
      table.string('country', 20).notNullable()
      table.string('province', 5).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
