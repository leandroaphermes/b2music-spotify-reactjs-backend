'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Playlist extends Model {

    tracks(){
        return this.belongsToMany('App/Models/Track').pivotTable('playlist_track')
    }

    owner(){
        return this.belongsTo('App/Models/User')
    }

}

module.exports = Playlist
