'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Album extends Model {

    author(){
        return this.belongsTo('App/Models/Author')
    }

    genres(){
        return this.belongsToMany('App/Models/Genre').pivotTable('album_genre')
    }

    tracks(){
        return this.hasMany('App/Models/Track')
    }

}

module.exports = Album
