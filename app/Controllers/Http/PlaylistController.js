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
        const data = await Playlist.query().with('owner', (bilder) => {
            bilder.select([ 'id', 'truename', ])
        }).fetch()
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
                validations.max([255])
            ]
        }


        await validateAll(data, rules, Antl.list('validation'))
        .then( async () => {
            try {
                sanitize(data, {
                    name: "trim"
                })

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
                }).first()
                
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
    
}

module.exports = PlaylistController
