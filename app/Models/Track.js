'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Track extends Model {

    authors (){
        return this.belongsToMany('App/Models/Author').pivotTable('author_track')
    }

}

module.exports = Track
