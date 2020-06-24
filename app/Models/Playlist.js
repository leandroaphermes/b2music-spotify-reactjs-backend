'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

class Playlist extends Model {

    tracks(){
        return this.belongsToMany('App/Models/Track').pivotModel('App/Models/PlaylistTrack')
    }

    owner(){
        return this.belongsTo('App/Models/User')
    }
    
    getPhotoUrl(photo_url){
        return photo_url !== "" ? `${Env.get('NODE_ENV') === 'development' ? Env.get('APP_URL') : Env.get('APP_URL_PUBLIC')}/${Env.get('PREFIX_ROUTER')}/playlists/file/image/${photo_url}` : ""
    }

}

module.exports = Playlist
