'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Track = use('App/Models/Track');


class TrackController {

    async index(){

        const data = await Track.all()
        return data
    }

    async store({ request, response }){

        let data = request.only([
            "name", "album_id", "authors_id", "src", "duration", "playcount"
        ])

        const rules = {
            name: [
                validations.required(),
                validations.string(),
                validations.min([3]),
                validations.max([100]),
                validations.regex( [new RegExp( /^(?:[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s?)*$/g )] )
            ],
            album_id: "required|number",
            authors_id: "required|array",
            'authors_id.*.author_id': "required|integer",
            src: "required|string|min:6|max:255",
            duration: "required|number"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {

                sanitize(data, {
                    name: "trim"
                })

                let authors = data.authors_id
                delete data.authors_id

                const dataRes = await Track.create(data)
                await dataRes.authors().attach( authors )

                response.status(201).send(dataRes)
            } catch (error) {
                console.log(error)
            }

        })
        .catch( dataError  => {
            console.log("Validator Error", dataError)
            response.status(422).send(dataError)
        }) 
        
    }

    async show({ request, response }){

        const data = request.params

        const rules = {
            id: "required|number"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                const datRes = await Track.findOrFail(data.id)
                response.status(200).send(datRes)
            } catch (error) {
                console.log(error)
            }
        })
        .catch( dataError => {
            console.log(dataError)
            response.status(422).send(dataError)
        })

    }

}

module.exports = TrackController
