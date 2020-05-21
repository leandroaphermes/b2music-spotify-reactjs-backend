'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Card = use('App/Models/Card')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist')

class CardController {

    async index(){

        const dataRes = await Card.all()

        return dataRes
    }

    async store({ request, response }){

        const data = request.only([ "type", "title", "genre_id", "description"])

        const rules = {
            type: "required|string|in:latest,all,genre",
            genre_id: 'required_when:type,genre|number',
            title: "required|string|min:4|max:100",
            description: "required|string|min:4|max:255"
        }

        await validateAll(data, rules, Antl.list("validation"))
        .then( async () => {
            try {
                
                const dataRes = await Card.create(data)
                response.created(dataRes)

            } catch (error) {
                console.log(error)
            }
        })
        .catch( dataError => {
            console.log("Validator:", dataError)
            response.unprocessableEntity(dataError)
        })

    }

    async storePlaylist({ params, response }){

        const data = params
        const rules = {
            id: "required|number",
            playlist_id: "required|number"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {

            try {
                
                const card = await Card.findOrFail(data.id)

                const playlist = await Playlist.findOrFail(data.playlist_id)

                await card.playlists().attach([ playlist.id ])

                response.noContent()

            } catch (error) {
                console.log(error)
                response.internalServerError()
            }

        })
        .catch( dataError => {
            console.log("Validator: ", dataError)
            response.unprocessableEntity(dataError)
        })


    }

}

module.exports = CardController
