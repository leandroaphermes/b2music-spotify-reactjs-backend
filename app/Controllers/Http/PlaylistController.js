'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist');

class PlaylistController {

    async index(){
        const data = await Playlist.all()
        return data
    }

    async store({ request, response }){

        const data = request.only([
            "user_id", "name", "description"
        ])

        const rules = {
            user_id: "required|number",
            name: [
                validations.required(),
                validations.min([3]),
                validations.max([100]),
                validations.regex([ new RegExp( /^(?:[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s?)*$/g ) ])
            ],
            description: [
                validations.required(),
                validations.max([255]),
                validations.regex([ new RegExp( /^(?:[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s?)*$/g ) ])
            ]
        }


        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {

            console.log(data)
            const dataRes = await Playlist.create(data)
            response.status(201).send(dataRes)
        } )
        .catch( dataErro => {
            console.log("Validate Error", dataErro)
            response.status(422).send(dataErro)
        })


    }

}

module.exports = PlaylistController
