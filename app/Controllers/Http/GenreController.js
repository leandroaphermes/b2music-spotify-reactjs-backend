'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations, extend } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Genre = use('App/Models/Genre')

const uniqueValidation = use("App/Validations/Extends/unique.js")

const NotFoundException = use('App/Exceptions/NotFoundException')
const { ALFA_NUMBER_SPACE_CS, HEX_COLOR_VALIDATION_CS } = require('../../../config/const-regex')

class GenreController {

  async index(){
    const dataRes = Genre.all()
    return dataRes
  }

  async store({ request, response }){

    extend('unique', uniqueValidation)

    const data = request.only([ 
      "name", 
      "description", 
      "url", 
      "color"
    ])
    const rules = {
      name: [
        validations.required(),
        validations.string(),
        validations.min([3]),
        validations.max([50]),
        validations.unique([ 'genres', 'name' ]),
        validations.regex([ ALFA_NUMBER_SPACE_CS ])
      ],
      description: "required|string|min:4|max:255",
      url: "required|string|min:3|max:50|unique:genres,url",
      color: [
        validations.required(),
        validations.string(),
        validations.min([3]),
        validations.max([6]),
        validations.regex([ HEX_COLOR_VALIDATION_CS ])
      ]
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async () => {

      try {

        sanitize(data, {
          name: "trim",
          description: "trim",
          url: "trim|lower_case",
          color: "trim|lower_case"
        })

        const dataRes = await Genre.create(data)
        response.created(dataRes)

      } catch (error) {
        response.internalServerError()
      }

    })
    .catch( dataError => {
      console.log("Validator", dataError)
      response.unprocessableEntity(dataError)
    })

  }

  async show({ request, response }){
    
    const data = request.params
    const rules = {
      genre_url: "required|string|min:3|max:30"
    }

    await validateAll( data, rules, Antl.list('validation'))
      .then( async () => {
        try {
          
          const dataRes = await Genre.query()
            .where("url", data.genre_url)
            .with( 'albums', (builder) => {
              builder.with('author', (builder) => {
                builder.select([
                  "id",
                  "name"
                ])
              })
            })
            .first()

          if(!dataRes){
            throw new NotFoundException( Antl.formatMessage("genre.notFound") )
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
        response.unprocessableEntity(dataError)
      })


  }

}

module.exports = GenreController
