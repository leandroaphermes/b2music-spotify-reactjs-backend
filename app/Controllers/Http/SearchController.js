'use strict'

/** @type {typeof import('indicative/src/Validator')} */
const { validateAll, validations } = use('indicative/validator')

/** @type {typeof import('indicative/src/Sanitizer')} */
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Author = use('App/Models/Author')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Track = use('App/Models/Track')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Album = use('App/Models/Album')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SearchController {

  async show ({ request, response }){

    const data = request.params
    const rules = {
      search: "required|string|min:1|max:50"
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async() => {
      try {

        const result = {}

        const tracks = await Track.query()
          .with('authors', (builder) => {
              builder.select([ "id", "name" ])
          })
          .with('album', (builder) => {
              builder.select([ "id", "name", "photo_url" ])
          })
          .where("name", "LIKE", `%${data.search}%`)
          .orderBy('playcount', 'desc')
          .paginate(1, 5)

        const playlists = await Playlist.query()
          .with('owner', (builder) => {
              builder.select([ "id", "username", "truename" ])
          })
          .where("name", "LIKE", `%${data.search}%`)
          .orderBy('playcount', 'desc')
          .paginate(1, 5)

        const authors = await Author.query()
          .select([ "id", "name", "photo_url" ])
          .where("name", "LIKE", `%${data.search}%`)
          .orderBy('name', 'asc')
          .paginate(1, 5)

        const albums = await Album.query()
          .with('author', (builder) => {
              builder.select([ "id", "name" ])
          })
          .where("name", "LIKE", `%${data.search}%`)
          .orderBy('name', 'asc')
          .paginate(1, 5)

        const users = await User.query()
          .select([ "id", "username", "truename" ])
          .where("truename", "LIKE", `%${data.search}%`)
          .orderBy('truename', 'asc')
          .paginate(1, 5)

        result.tracks = tracks
        result.playlists = playlists
        result.authors = authors
        result.albums = albums
        result.users = users

        response.ok(result)

      } catch (error) {
        response.internalServerError(error)
      }
    })
    .catch( dataError => {
      response.unprocessableEntity(dataError)
    })

  }

  async showTracks({ request, response }){
    const data = request.params
    const rules = {
      search: "required|string|max:50"
    }

    await validateAll(data, rules, Antl.list('validation'))
    .then( async() => {
      try {
        const tracks = await Track.query()
          .with('authors', (builder) => {
              builder.select([ "id", "name" ])
          })
          .with('album', (builder) => {
              builder.select([ "id", "name", "photo_url" ])
          })
          .where("name", "LIKE", `%${data.search}%`)
          .orderBy('playcount', 'desc')
          .limit(8)
          .fetch()

        response.ok(tracks)

      } catch (error) {
        response.internalServerError(error)
      }
    })
    .catch( dataError => {
      response.unprocessableEntity(dataError)
    })

  }
}

module.exports = SearchController
