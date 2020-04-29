'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Album = use('App/Models/Album')

class AlbumController {

    async index() {
        const data = await Album.all()
        return data
    }

    async store({ request, response }){

        const data = request.only([
            "author_id",
            "genres",
            "name",
            "categories",
            "releasedt",
            "photo_url"
        ])

        const rules = {
            author_id: "required|number",
            genres: "required|array",
            name: [
                validations.required(),
                validations.min([ 3 ]),
                validations.max([ 100 ]),
                validations.regex( [new RegExp( /^(?:[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s?)*$/g )] )
            ],
            categories: "in:single,ep,album",
            releasedt: [
                validations.required(),
                validations.dateFormat(['YYYY-MM-DD']),
                validations.date()
            ],
            photo_url: "required|url|min:4|max:255",
        }

        const sintatization = {
            name: "trim|lower_case",
            categories: "trim|lower_case",
            photo_url: "trim|lower_case"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                
                sanitize(data, sintatization)

                const { genres, ...rest_data } = data

                const dataRes = await Album.create(rest_data)
                dataRes.genres().attach(genres)

                response.created(dataRes)

            } catch (error) {
                console.log(error);
                
            }
        })
        .catch( dataError => {
            console.log("Validator Error:", dataError, data.name)
			response.unprocessableEntity(dataError)
        })


    }

    async show ({ request, response }) {

        const data = request.params
        const rules = {
            id: "required|number"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                const dataRes = await Album.findOrFail(data.id)
                response.ok(dataRes)
            } catch (error) {
                console.log(error)
                response.internalServerError()
            }
        })
        .catch( dataError => {
            console.log("Validator Error", dataError)
            response.unprocessableEntity(dataError)
        })

    }

}

module.exports = AlbumController
