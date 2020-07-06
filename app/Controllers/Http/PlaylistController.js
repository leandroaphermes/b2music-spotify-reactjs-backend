'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')

const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Track = use('App/Models/Track')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Followers = use('App/Models/Followers')

const uuidv4 = require("uuid/v4");
const Env = use('Env')
const Helpers = use('Helpers')

const NotFoundException = use('App/Exceptions/NotFoundException')
const ForbiddenException = use('App/Exceptions/ForbiddenException')
const ConflictException = use('App/Exceptions/ConflictException')
const { ModelNotFoundException } = require('@adonisjs/lucid/src/Exceptions')

const { ALFA_NUMBER_SPACE_CS } = require('../../../config/const-regex')
const { UPLOAD_IMG, UPLOAD_IMG_EXTNAMES, UPLOAD_IMG_SIZE } = require('../../../config/upload.js')


class PlaylistController {

  async index(){
    const data = await Playlist.query()
    .with('owner', (builder) => {
      builder.select([ 'id', 'truename' ])
    })
    .fetch()
    return data
  }

  async store({ request, auth, response }){

    let data = request.only([ 
      "name", "description"
    ])

    const rules = {
      name: [
        validations.required(),
        validations.min([3]),
        validations.max([100]),
        validations.regex([ ALFA_NUMBER_SPACE_CS ])
      ],
      description: [
        validations.string(),
        validations.min([0]),
        validations.max([255])
      ]
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async () => {
      try {
        sanitize(data, {
          name: "trim"
        })

        const photo = request.file("photo", {
          types: UPLOAD_IMG,
          extnames: UPLOAD_IMG_EXTNAMES,
          size: UPLOAD_IMG_SIZE
        })

        let filename = ""
        
        if(photo){
          filename = `${new Date().getTime()}-${uuidv4()}.${photo.subtype}`
      
          await photo.move( Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/playlists`), {
            name: filename,
            overwrite: true
          })

          if (!photo.moved()) {
            const erro = photo.error()
            return response.unprocessableEntity({
              message: erro.message,
              type: erro.type,
              field: erro.fieldName
            })
          }
        }

        data.user_id = auth.user.id
        data.photo_url = filename

        const dataRes = await Playlist.create(data)

        await Followers.create({
          album_id: null,
          author_id: null,
          playlist_id: dataRes.id,
          user_id: dataRes.user_id,
          type: 'playlist'
        })

        response.created(dataRes)
      } catch (error) {
        console.log(error);
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

        const dataRes = await Playlist.query()
          .where({ id: data.id })
          .with('owner', (builder) => {
            builder.select([ 'id', 'truename', 'username' ])
          })
          .with('tracks', (builder) => {
            builder.with('authors', builder => {
                builder.select(['id', 'name'])
            })
            .with('album', (builder) => {
                builder.select([ 'id', 'name', 'photo_url' ])
            })
          })
          .first()
        
        if(!dataRes){
          throw new NotFoundException(Antl.formatMessage("playlist.notFound"))
        }

        const followersCount = await Followers.query()
          .where({
            playlist_id: dataRes.id
          })
          .count('* as total_followers')
        
        dataRes.total_followers = followersCount[0].total_followers

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
    .catch( dataErro => {
        console.log(dataErro)
        response.unprocessableEntity(dataErro)
    })

  }

  async update({ request, auth, response }){

    const data = request.only([ "name", "description" ])
    data.id = request.params.id

    const rules = {
      id: "required|number",
      name: [
        validations.required(),
        validations.min([3]),
        validations.max([100]),
        validations.regex([ ALFA_NUMBER_SPACE_CS ])
      ],
      description: [
        validations.string(),
        validations.min([0]),
        validations.max([255])
      ]
    }

    await validateAll(data, rules, Antl.list("validation"))
    .then( async ()=> {
      try {

        const dataRes = await Playlist.findOrFail(data.id)

        if(dataRes.user_id !== auth.user.id){
          throw new ForbiddenException(Antl.formatMessage('playlists.ownerFiled'))
        }

        const photo = request.file("photo", {
          types: UPLOAD_IMG,
          extnames: UPLOAD_IMG_EXTNAMES,
          size: UPLOAD_IMG_SIZE
        })

        let filename = ""
        
        if(photo){
          filename = `${new Date().getTime()}-${uuidv4()}.${photo.subtype}`
      
          await photo.move( Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/playlists`), {
            name: filename,
            overwrite: true
          })

          if (!photo.moved()) {
            const erro = photo.error()
            return response.unprocessableEntity({
              message: erro.message,
              type: erro.type,
              field: erro.fieldName
            })
          }
        }

        dataRes.merge({
          name: data.name,
          description: (data.description) ? data.description : "",
          photo_url: (filename) ? filename : dataRes.photo_url
        })

        await dataRes.save()

        response.ok(dataRes)

      } catch (error) {
        if(error instanceof ModelNotFoundException ){
          return response.notFound({
            message: Antl.formatMessage("playlist.notFound")
          })
        }else if(error instanceof ForbiddenException ){
          return response.forbidden({
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

  async destroy({ request, auth, response }){

    const data = request.params

    const rules = {
      id: "required|number"
    }

    await validateAll(data, rules, Antl.list("validation"))
    .then( async () => {
      try {

        const playlist = await Playlist.findByOrFail("id", data.id)
        
        if(playlist.user_id !== auth.user.id){
          throw new ForbiddenException(Antl.formatMessage('playlist.ownerFiled'))
        }

        await playlist.delete()

      } catch (error) {
        if(error instanceof ModelNotFoundException ){
          return response.notFound({
            message: Antl.formatMessage("playlist.notFound")
          })
        }else if(error instanceof ForbiddenException ){
          return response.forbidden({
            message: error.message
          })
        }else{
          response.internalServerError()
        }
      }
    })
    .catch(dataError => {
      console.log(dataError);
      
      response.unprocessableEntity(dataError)
    })

  }

  async storeTrack({ request, auth, response }){

    const data = request.params
    
    const rules = {
      id: "required|number",
      track_id: "required|number"
    }

    await validateAll(data, rules, Antl.list('validator'))
    .then( async () => {

      try {
        
        const playlist = await Playlist.find(data.id)
        if(!playlist) throw new NotFoundException(Antl.formatMessage("palylist.notFound"))

        if(playlist.user_id !== auth.user.id){
          throw new ForbiddenException(Antl.formatMessage('playlist.ownerFiled'))
        }
        
        const track = await Track.find(data.track_id)
        if(!track) throw new NotFoundException(Antl.formatMessage("track.notFound"))

        const isTrackExist = await playlist.tracks()
          .where('track_id', track.id)
          .fetch()

        if(isTrackExist.rows.length !== 0){
          throw new ConflictException(Antl.formatMessage('playlist.isAlreadyAddedTrack'))
        }
        
        await playlist.tracks().attach(track.id)
        response.noContent()

      } catch (error) {
        if(error instanceof NotFoundException ){
          return response.notFound({
            message: error.message
          })
        }else if(error instanceof ConflictException ){
          return response.conflict({
            message: error.message
          })
        }else if(error instanceof ForbiddenException ){
          return response.forbidden({
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

  async destroyTrack({ request, auth, response}){

    const data = request.params

    const rules = {
      id: "required|number",
      track_id: "required|number"
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async () => {
      try {
          
        const playlist = await Playlist.find(data.id)
        if(!playlist) throw new NotFoundException(Antl.formatMessage("palylist.notFound"))

        if(playlist.user_id !== auth.user.id){
          throw new ForbiddenException(Antl.formatMessage('playlist.ownerFiled'))
        }
        
        const isTrackExist = await playlist.tracks()
          .where('track_id', data.track_id)
          .fetch()
        if(isTrackExist.rows.length !== 1){
            throw new ConflictException(Antl.formatMessage('playlists.isAlreadyRemovedTrack'))
        }
        
        await playlist.tracks().detach(data.track_id)
        response.noContent()

      } catch (error) {
        if(error instanceof NotFoundException ){
          return response.notFound({
            message: error.message
          })
        }else if(error instanceof ConflictException ){
          return response.conflict({
            message: error.message
          })
        }else if(error instanceof ForbiddenException ){
          return response.forbidden({
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

  fileImage({ params, response}){

    if(params.file === ""){
      return ""
    }

    return response.download(Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/playlists/${params.file}`))

  }
}

module.exports = PlaylistController
