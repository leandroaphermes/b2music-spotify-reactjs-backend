'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Genre = use('App/Models/Genre');


class GenreController {

    async index(){

        const dataRes = Genre.all()
        return dataRes

    }

    async store({ request, response }){

        const data = request.only([ "name", "description" ])
        const rules = {
            name: [
                validations.required(),
                validations.string(),
                validations.min([3]),
                validations.max([50]),
                validations.regex( new RegExp(/^(?:[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s?)*$/g))
            ],
            description: "required|string|min:4|max:255"
        }

        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {

            try {
                
                sanitize(data, {
                    name: "trim",
                    description: "trim",
                })

                const dataRes = await Genre.create(data)
                response.created(dataRes)

            } catch (error) {
                
            }

        })
        .catch( dataError => {
            console.log("Validator", dataError);
            response.unprocessableEntity(dataError)
        })

    }

}

module.exports = GenreController
