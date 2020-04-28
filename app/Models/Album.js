'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Album extends Model {

    genres(){
        return this.belongsToMany('App/Models/Genre').pivotTable('album_genre')
    }

}

module.exports = Album
