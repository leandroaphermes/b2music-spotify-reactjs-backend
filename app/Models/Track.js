'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const TrackHasAuthor = use('App/Models/TrackHasAuthor')

class Track extends Model {

    authors (){
        return this.hasMany('App/Models/TrackHasAuthor')
    }

}

module.exports = Track
