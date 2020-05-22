'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PlaylistHistory extends Model {

  playlist (){
    return this.belongsTo("App/Models/Playlist")
  }

}

module.exports = PlaylistHistory
