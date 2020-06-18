'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Followers extends Model {

  playlist(){
    return this.belongsTo('App/Models/Playlist')
  }

  author(){
    return this.belongsTo('App/Models/Author')
  }

  album(){
    return this.belongsTo('App/Models/Album')
  }

  track(){
    return this.belongsTo('App/Models/Track')
  }

}

module.exports = Followers
