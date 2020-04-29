'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')

/** @type {typeof import('indicative/src/Sanitizer')} */
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Track = use('App/Models/Track')

class PlaylistController {

    async index(){
        const data = await Playlist.query().with('owner', (builder) => {
            builder.select([ 'id', 'truename' ])
        }).fetch()
        return data
    }

    async store({ request, auth, response }){

        let data = request.only([ 
            "name", "description", "photo_url"
        ])

        const rules = {
            name: [
                validations.required(),
                validations.min([3]),
                validations.max([100]),
                validations.regex([ new RegExp( /^(?:[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s?)*$/g ) ])
            ],
            description: [
                validations.required(),
                validations.max([255])
            ]
        }


        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                sanitize(data, {
                    name: "trim"
                })
                
                data.user_id = auth.user.id

                const dataRes = await Playlist.create(data)
                response.created(dataRes)
            } catch (error) {
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
                        builder.select([ 'id', 'truename' ])
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

                
                if(playlist.user_id !== auth.user.id) return response.unauthorized({
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

                if(playlist.user_id !== auth.user.id) return response.unauthorized({
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
    
}

module.exports = PlaylistController
