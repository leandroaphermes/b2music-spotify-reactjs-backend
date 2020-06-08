'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')

const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Track = use('App/Models/Track')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Followers = use('App/Models/Followers')

const RecordNotFoundException = use('App/Exceptions/RecordNotFoundException')

const uuidv4 = require("uuid/v4");
const Env = use('Env')
const Helpers = use('Helpers')
const { UPLOAD_IMG, UPLOAD_IMG_EXTNAMES, UPLOAD_IMG_SIZE } = require('../../../config/upload.js')

class PlaylistController {

    async index(){
        const data = await Playlist.query().with('owner', (builder) => {
            builder.select([ 'id', 'truename' ])
        }).fetch()
        return data
    }

    async store({ request, auth, response }){

        let data = request.only([ 
            "name", "description"
        ])

        const rules = {
            name: [
                validations.required(),
                validations.min([3]),
                validations.max([100])
            ],
            description: [
                validations.string(),
                validations.min([0]),
                validations.max([255]),
            ]
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                sanitize(data, {
                    name: "trim"
                })

                const photo = request.file("photo", {
                    types: UPLOAD_IMG,
                    extnames: UPLOAD_IMG_EXTNAMES,
                    size: UPLOAD_IMG_SIZE
                })

                let filename = ""
                
                if(photo){
                    filename = `${new Date().getTime()}-${uuidv4()}.${photo.subtype}`
                
                    await photo.move( Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/playlists`), {
                        name: filename,
                        overwrite: true
                    })
    
                    if (!photo.moved()) {
                        const erro = photo.error()
                        return response.unprocessableEntity({
                            message: erro.message,
                            type: erro.type,
                            field: erro.fieldName
                        })
                    }
                }

                data.user_id = auth.user.id
                data.photo_url = filename

                

                const dataRes = await Playlist.create(data)

                await Followers.create({
                    album_id: null,
                    author_id: null,
                    playlist_id: dataRes.id,
                    user_id: dataRes.user_id,
                    type: 'playlist'
                })

                response.created(dataRes)
            } catch (error) {
                console.log(error);
                response.internalServerError()
            }
        })
        .catch( dataErro => {
            console.log("Validate Error", dataErro)
            response.unprocessableEntity(dataErro)
        })


    }
    
    async show({ request, response }) {
        
        const data = request.params
        const rules = {
            id: "required|number"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {

                const dataRes = await Playlist.query()
                    .where({ id: data.id })
                    .with('owner', (builder) => {
                        builder.select([ 'id', 'truename', 'username' ])
                    })
                    .with('tracks', (builder) => {
                        builder.with('authors', builder => {
                            builder.select(['id', 'name'])
                        })
                        .with('album', (builder) => {
                            builder.select([ 'id', 'name', 'photo_url' ])
                        })
                    })
                    .first()
                
                if(dataRes === null){
                   return response.notFound()
                }

                const followersCount = await Followers.query()
                    .where({
                        playlist_id: dataRes.id
                    })
                    .count('* as total_followers')
                
                dataRes.total_followers = followersCount[0].total_followers

                response.ok(dataRes)

            } catch (error) {
                console.log(error);
                
                response.internalServerError()
            }
        })
        .catch( dataErro => {
            console.log(dataErro)
            response.unprocessableEntity(dataErro)
        })

    }

    async update({ request, auth, response }){

        const data = request.only([ "name", "description" ])
        data.id = request.params.id

        const rules = {
            id: "required|number",
            name: "required|string|min:3|max:100",
            description: "string|min:0|max:255"
        }

        await validateAll(data, rules, Antl.list("validation"))
        .then( async ()=> {
            try {


                
                const dataRes = await Playlist.findOrFail(data.id)

                if(dataRes.user_id !== auth.user.id){
					return response.forbidden({
						message: Antl.formatMessage('playlists.ownerFiled')
					})
                }


                const photo = request.file("photo", {
                    types: UPLOAD_IMG,
                    extnames: UPLOAD_IMG_EXTNAMES,
                    size: UPLOAD_IMG_SIZE
                })

                let filename = ""
                
                if(photo){
                    filename = `${new Date().getTime()}-${uuidv4()}.${photo.subtype}`
                
                    await photo.move( Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/playlists`), {
                        name: filename,
                        overwrite: true
                    })
    
                    if (!photo.moved()) {
                        const erro = photo.error()
                        return response.unprocessableEntity({
                            message: erro.message,
                            type: erro.type,
                            field: erro.fieldName
                        })
                    }
                }

                dataRes.merge({
                    name: data.name,
                    description: (data.description) ? data.description : "",
                    photo_url: (filename) ? filename : dataRes.photo_url
                })

                await dataRes.save()

                response.ok(dataRes)

            } catch (error) {
                response.internalServerError()
            }
        })
        .catch( dataError => {
            response.unprocessableEntity(dataError)
        })
    }

    async destroy({ request, auth, response }){

        const data = request.params

        const rules = {
            id: "required|number"
        }

        await validateAll(data, rules, Antl.list("validation"))
        .then( async () => {

            try {


                console.log("CHEGOU POR AQUI");
                throw new RecordNotFoundException()
                console.log("CHEGOU POR AQUI 2");

             /*    const playlist = await Playlist.findOrFail(data.id)
 */

            } catch (error) {
            }

        })
        .catch( dataError => {
            response.unprocessableEntity(dataError)
        })

    }

    async storeTrack({ request, auth, response }){

        const data = request.params
        
        const rules = {
            id: "required|number",
            track_id: "required|number"
        }

        await validateAll(data, rules, Antl.list('validator'))
        .then( async () => {

            try {
                
                const playlist = await Playlist.findOrFail(data.id)

                
                if(playlist.user_id !== auth.user.id) return response.forbidden({
                    message: Antl.formatMessage('playlists.ownerFiled')
                })
                
                const track = await Track.findOrFail(data.track_id)

                const isTrackExist = await playlist.tracks().where('track_id', track.id).fetch()
                if(isTrackExist.rows.length !== 0){
                    return response.conflict({
                        message: Antl.formatMessage('playlists.isAlreadyAddedTrack')
                    })
                }
                
                await playlist.tracks().attach(track.id)
                response.noContent()

            } catch (error) {
                console.log(error)
                response.internalServerError()
            }

        })
        .catch( dataError => {
            console.log("Validator", dataError);
            response.unprocessableEntity(dataError)
        })

    }

    async destroyTrack({ request, auth, response}){

        const data = request.params

        const rules = {
            id: "required|number",
            track_id: "required|number"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                
                const playlist = await Playlist.findOrFail(data.id)

                if(playlist.user_id !== auth.user.id) return response.forbidden({
                    message: Antl.formatMessage('playlists.ownerFiled')
                })
                
                const isTrackExist = await playlist.tracks().where('track_id', data.track_id).fetch()
                if(isTrackExist.rows.length !== 1){
                    return response.conflict({
                        message: Antl.formatMessage('playlists.isAlreadyRemovedTrack')
                    })
                }
                
                await playlist.tracks().detach(data.track_id)
                response.noContent()

            } catch (error) {
                console.log(error)
                response.internalServerError()
            }
        })
        .catch( dataError => {
            console.log("Validator Error", dataError);
            response.unprocessableEntity(dataError)
        })

    }

    fileImage({ params, response}){

        if(params.file === ""){
            return ""
        }

        return response.download(Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/playlists/${params.file}`))

    }
}

module.exports = PlaylistController
