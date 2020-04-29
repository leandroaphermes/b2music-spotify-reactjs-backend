'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Card extends Model {
    static get createdAtColumn() {
        return null
    }
    static get updatedAtColumn() {
        return null
    }

    playlists(){
        return this.belongsToMany('App/Models/Playlist').pivotTable('card_playlist')
    }

}

module.exports = Card
