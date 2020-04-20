'use strict'

const Env = use('Env')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Track extends Model {

    authors (){
        return this.belongsToMany('App/Models/Author').pivotTable('author_track')
    }

    getSrc(src){
        return `${Env.get('APP_URL')}/tracks/file/${src}`
    }

}

module.exports = Track
