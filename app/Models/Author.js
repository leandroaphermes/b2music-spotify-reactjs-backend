'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Author extends Model {

    tracks (){
        return this.belongsToMany('App/Models/Track').pivotTable('author_track')
    }
    
    albums (){
        return this.hasMany('App/Models/Album')
    }

}

module.exports = Author
