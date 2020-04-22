'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')

/** @type {typeof import('indicative/src/Sanitizer')} */
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist');

const Database = use('Database')

class PlaylistController {

    async index(){
        const data = await Playlist.query().with('owner', (bilder) => {
            bilder.select([ 'id', 'truename', ])
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

                const dataRes = await Playlist.query().where({ id: data.id }).with('owner', (bilder) => {
                    bilder.select([ 'id', 'truename' ])
                }).with('tracks').first()
                
                if(dataRes === null){
                   return response.notFound()
                }
                response.ok(dataRes)

            } catch (error) {
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
    
                const isTrackExist =  await Database.from('playlist_track').where({ 'playlist_id': playlist.id, 'track_id': data.track_id })
                if(isTrackExist && isTrackExist.length !== 0){
                    return response.conflict({
                        message: Antl.formatMessage('playlists.isAlreadyAdded')
                    })
                }
                
                await playlist.tracks().attach(data.track_id)
                response.created()

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
    
}

module.exports = PlaylistController
