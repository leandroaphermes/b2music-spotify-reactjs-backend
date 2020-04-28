'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Genre extends Model {   
    
    albums(){
        return this.belongsToMany('App/Models/Album').pivotTable('album_genre')
    }
}

module.exports = Genre
