'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Album = use('App/Models/Album');

class AlbumController {

    async index() {
        const data = await Album.all()
        return data
    }

    async store({ request, response }){

        const data = request.only([
            "author_id",
            "genre_id",
            "name",
            "categories",
            "releasedt",
            "photo_url"
        ])

        const rules = {
            author_id: "required|number",
            genre_id: "required|number",
            name: [
                validations.required(),
                validations.min([ 3 ]),
                validations.max([ 100 ]),
                validations.regex(["^[\\w\-\\s]+"])
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

			sanitize(data, sintatization)

            const dataRes = await Album.create(data)
            response.status(201).send(dataRes)
            return data

        })
        .catch( dataError => {
            console.log("Validator Error:", dataError, data.name)
			response.status(422).send(dataError)
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
                response.status(200).send(dataRes)
            } catch (error) {
                response.status(500).send()
            }
        })
        .catch( dataError => {
            console.log("Validator Error", dataError)
            response.status(422).send(dataError)
        })

    }

}

module.exports = AlbumController
