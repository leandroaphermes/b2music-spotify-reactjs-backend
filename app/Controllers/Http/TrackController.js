'use strict'

const Env = use('Env')
const Helpers = use('Helpers')

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Track = use('App/Models/Track')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Album = use('App/Models/Album')

const NotFoundException = use('App/Exceptions/NotFoundException')
const { ModelNotFoundException } = require('@adonisjs/lucid/src/Exceptions')

const { ALFA_NUMBER_SPACE_CS } = require('../../../config/const-regex')
const { UPLOAD_AUDIO, UPLOAD_AUDIO_EXTNAMES, UPLOAD_AUDIO_SIZE } = require('../../../config/upload.js')

class TrackController {

  async index(){
    const data = await Track.all()
    return data
  }

  async store({ request, response }){

    let data = request.only([
      "name", "album_id", "authors", "duration"
    ])
    
    const track_file = request.file("track_file", {
      type: UPLOAD_AUDIO,
      size: UPLOAD_AUDIO_SIZE,
      extnames: UPLOAD_AUDIO_EXTNAMES
    })
    
    
    const rules = {
      name: [
        validations.required(),
        validations.string(),
        validations.min([3]),
        validations.max([100]),
        validations.regex( [ ALFA_NUMBER_SPACE_CS ] )
      ],
      album_id: "required|number",
      authors: "required|array",
      'authors.*.author_id': "required|integer",
      duration: "required|number"
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async () => {
      try {

        sanitize(data, {
          name: "trim"
        })

        const { authors, ...rest_data } = data

        const validAlbum = await Album.find(data.album_id)
        if(!validAlbum) throw new NotFoundException(Antl.formatMessage("album.notFound"))

          
        rest_data.src = `track-${rest_data.album_id}-${uuidv4()}.mp3`

        await track_file.move(Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/tracks`), {
          name: rest_data.src,
          overwrite: true
        })
        if (!track_file.moved()) {
          return track_file.error()
        }

        const dataRes = await Track.create(rest_data)
        await dataRes.authors().attach( authors )

        
        response.created(dataRes)

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
    .catch( dataError  => {
      response.unprocessableEntity(dataError)
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
        response.ok(datRes)

      } catch (error) {
        if(error instanceof ModelNotFoundException ){
          return response.forbidden({
            message: Antl.formatMessage("track.notFound")
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

  file({ params, response}){

    return response.download(Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/tracks/${params.file}`))

  }

}

module.exports = TrackController
