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

    static get dates() {
        return super.dates.concat(['releasedt'])
    }
    
    static castDates(field, value) {
        if (field === 'releasedt') {
            return value.format('YYYY-MM-DD')
        }
        return super.formatDates(field, value)
    }

}

module.exports = Album
