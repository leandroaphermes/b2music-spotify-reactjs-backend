'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Author = use('App/Models/Author')

const NotFoundException = use('App/Exceptions/NotFoundException')

const { ALFA_NUMBER_SPACE_CS } = require('../../../config/const-regex')

class AuthorController {

  async index(){
      const data = await Author.all()
      return data
  }

  async store({ request, response }){
  
    const data = request.only([ 
      "name",
      "photo_url",
      "bio",
      "site",
      "wikipedia",
      "instagram",
      "twitter",
      "facebook"
    ])

    const rules = {
      name: [
        validations.required(),
        validations.min([ 3 ]),
        validations.max([ 100 ]),
        validations.regex( [ ALFA_NUMBER_SPACE_CS ] )
      ],
      photo_url: "required|url|min:4|max:255",
      bio: "required|string|min:4|max:2064",
      site: "required|url|min:4|max:255",
      wikipedia: "required|url|min:2|max:255",
      instagram: "required|string|min:2|max:255",
      twitter: "required|string|min:2|max:255",
      facebook: "required|string|min:2|max:255"
    }
    const sintatization = {
      name: "trim",
      photo_url: "trim",
      bio: "trim",
      site: "trim|lower_case",
      wikipedia: "trim|lower_case",
      instagram: "trim|lower_case",
      twitter: "trim|lower_case",
      facebook: "trim|lower_case"
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async () => {
      try {
      
        sanitize(data, sintatization)

        const dataRes = await Author.create(data)
        response.created(dataRes)
        return data
      
      } catch (error) {
        response.internalServerError()
      }
    })
    .catch( (dataError) => {
            console.log("Validator Error:", dataError, data.name)
      response.unprocessableEntity(dataError)
    })

  }

  async show ({ request, response}) {

    const data = request.params
    const rules = {
        id: "required|number"
    }
    await validateAll(data, rules, Antl.list('validation'))
    .then( async () => {
      try {

        const dataRes = await Author.query()
          .where({ id: data.id })
          .with('tracks', (builder) => {
            builder
              .select([
                "id",
                "name",
                "album_id",
                "duration"
              ])
              .with('album')
              .orderBy('playcount', 'desc')
              .limit(5)
          })
          .with('albums')
          .first()

        if(!dataRes){
          throw new NotFoundException( Antl.formatMessage("author.notFound") )
        }
        response.ok(dataRes)



      } catch (error) {
        if(error instanceof NotFoundException ){
          return response.notFound({
            message: error.message
          })
        }else{
          response.internalServerError()
        }
      }
    })
    .catch( dataError => {
      console.error("Erro Author: ", dataError);
      response.unprocessableEntity(dataError)
    })

  }
}

module.exports = AuthorController
