'use strict'

const { validateAll, validations } = use('indicative/validator')
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Followers = use('App/Models/Followers')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Card = use('App/Models/Card')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const PlaylistHistory = use('App/Models/PlaylistHistory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Playlist = use('App/Models/Playlist')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Album = use('App/Models/Album')

const ForbiddenException = use('App/Exceptions/ForbiddenException')
const { ModelNotFoundException } = require('@adonisjs/lucid/src/Exceptions')

const { ALFA_NUMBER_SPACE_CS, PHONE_VALIDATION, PASSWORD_VALIDATION } = require('../../../config/const-regex')
const { UPLOAD_IMG, UPLOAD_IMG_EXTNAMES, UPLOAD_IMG_SIZE } = require('../../../config/upload.js')

const uuidv4 = require("uuid/v4");
const Env = use('Env')
const Helpers = use('Helpers')
const Hash = use('Hash')
const moment = use('moment')

class MeController {

	async show({ auth, response }){

		try {
			
			const dataRes = await User.findOrFail(auth.user.id)
			delete dataRes.password
			response.ok(dataRes)

		} catch (error) {
			response.badRequest(Antl.formatMessage('authentication.badRequest'))
		}
	}

	async update({ request, auth, response }){

		const data = request.only([
			"truename",
			"phone",
			"gender",
			"birth",
			"country",
			"province"
		])
				
		const rules = {
			truename: [
				validations.required(),
				validations.min([4]),
				validations.max([100]),
				validations.regex([ ALFA_NUMBER_SPACE_CS ]),
			],
			phone: [
				validations.required(),
				validations.min([7]),
				validations.max([20]),
				validations.regex([ PHONE_VALIDATION ]),
			],
			gender: "required|alpha|in:F,M",
			birth: [
			  validations.required(),
			  validations.dateFormat(['YYYY-MM-DD']),
			  validations.date()
			],
			country: "required|alpha|min:2|max:3",
			province: "required|alpha|min:2|max:3"
		}
		const sintatization = {
			truename: "trim",
			phone: "trim|lower_case",
			gender: "trim|upper_case",
			country: "trim|upper_case",
			province: "trim|upper_case"
		}

		await validateAll(data, rules, Antl.list('validation'))
		.then( async () => {

			try {

				const user = await User.findOrFail(auth.user.id)

				sanitize(data, sintatization)

				user.merge(data)
				await user.save()

				response.ok(user)

			} catch (error) {
				if(error instanceof ModelNotFoundException){
					response.forbidden({
						message: Antl.formatMessage("user.userBadPerssionSave")
					})
				}else{
					response.internalServerError()
				}
			}

		})
		.catch(dataError => {
			response.unprocessableEntity(dataError)
		})

	}

	async updatePassword({ request, auth, response }){

		const data = request.only([ 
			"password_old",
			"password_new",
			"password_new_confirmation",
		])
		const rules = {
			password_old: [
				validations.required(),
				validations.min([6]),
				validations.max([32]),
				validations.regex([ PASSWORD_VALIDATION ])
			],
			password_new: [
				validations.required(),
				validations.min([6]),
				validations.max([32]),
				validations.regex([ PASSWORD_VALIDATION ]),
				validations.confirmed()
			]
		}

		await validateAll(data, rules, Antl.list("validation"))
		.then( async () => {
			
			try {

				const user = await User.findOrFail(auth.user.id)
	
				const validedPassOld = await Hash.verify(data.password_old, user.password )
	
				if(!validedPassOld){
					throw new ForbiddenException(Antl.formatMessage("user.passwordOldValidFailed"))
				}
	
				user.merge({
					password: data.password_new
				})
				user.save()

				
			} catch (error) {
				if(error instanceof ModelNotFoundException ){
					return response.forbidden({
						message: Antl.formatMessage("user.userBadPerssionSave")
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

	async uploadPhoto({ request, auth, response }) {

		try {

			const dataRes = await User.findOrFail(auth.user.id)


			const photo = request.file('photo', {
				types: UPLOAD_IMG,
				extnames: UPLOAD_IMG_EXTNAMES,
				size: UPLOAD_IMG_SIZE
			})
	
			const	filename = `${new Date().getTime()}-${uuidv4()}.${photo.subtype}`
	
			await photo.move( Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/users`), {
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

			dataRes.photo_url = filename
			await dataRes.save()
			
			response.ok({
				photo_url: dataRes.toObject().photo_url
			})

		} catch (error) {
			if(error instanceof ModelNotFoundException ){
				return response.forbidden({
					message: Antl.formatMessage("user.userBadPerssionSave")
				})
			}else{
				response.badRequest({
					message: Antl.formatMessage('user.notChangeImage')
				})
			}
		}

	}

	async homePage({ auth, response }){
		try {
			const dataRes = {

				cards: await Card.query()
					.with('playlists', (builder) =>{
						builder.select([ "id", "name", "description", "photo_url" ])
					})
					.fetch(),

				playlist_histories: await PlaylistHistory.query()
					.where({
						user_id: auth.user.id
					})
					.select([
						"id",
						"playlist_id",
						"album_id"
					])
					.with('playlist', (builder) => {
						builder.select([ "id", "name", "description", "photo_url" ])
					})
					.with('album', (builder) => {
						builder
							.select([ "id", "name", "photo_url", "author_id" ])
							.with('author', (builder) => {
								builder.
									select([ "id", "name" ])
							})
					})
					.orderBy("updated_at", "desc")
					.limit(10)
					.fetch(),

				playlist_all: await Playlist.query()
					.orderBy('created_at', 'desc')
					.limit(10)
					.fetch(),

				album_all: await Album.query()
					.with('author', (builder) => {
						builder.
							select([ "id", "name" ])
					})
					.orderBy('created_at', 'desc')
					.limit(10)
					.fetch()

			}
			return dataRes
		} catch (error) {
			console.log(error)
			response.internalServerError()
		}
	}

	async actionTracer({ request, auth, response }){

		const data = request.only([ "action_type", "action_click", "action_trigger", "payload" ])

		if(data.action_type === "set-new-playlist" ){

			const dataRes = await PlaylistHistory.query()
				.where({ 
					playlist_id: data.payload.playlist_id, 
					user_id: auth.user.id 
				})
				.first()

			if(dataRes && dataRes.id){
				dataRes.updated_at = moment().format('DD-MM-YYYY HH:mm:ss')
				await dataRes.save()
			}else{
				await PlaylistHistory.create({
					playlist_id: data.payload.playlist_id,
					user_id: auth.user.id,
					action: data.action_click
				})
			}



		}else if(data.action_type === "set-new-album") {

			const dataRes = await PlaylistHistory.query()
				.where({ 
					album_id: data.payload.album_id, 
					user_id: auth.user.id 
				})
				.first()

			if(dataRes && dataRes.id){
				dataRes.updated_at = moment().format('DD-MM-YYYY HH:mm:ss')
				await dataRes.save()
			}else{
				await PlaylistHistory.create({
					album_id: data.payload.album_id,
					user_id: auth.user.id,
					action: data.action_click
				})
			}


		}

		response.noContent()

	}

  async showFollowersPlaylists({ auth, response }) {

    const dataRes = await Followers.query()
      .where({ 
        user_id: auth.user.id,
        type: 'playlist',
       })
			 .select([
				 "id",
				 "playlist_id",
				 "type"
			 ])
      .with('playlist', (builder) => {
        builder.select([ "id", "name", "description", "photo_url" ])
      })
      .orderBy('created_at', 'desc')
      .fetch()

    response.ok(dataRes)

	}
	
	async showFollowersAuthors({ auth, response }){

		const dataRes = await Followers.query()
			.where({
				type: "author",
				user_id: auth.user.id
			})
			.select([
				"id",
				"author_id",
				"type"
			])
			.with('author', (builder) => {
				builder.select([
					"id", "name", "photo_url"
				])
			})
			.fetch()

			response.ok(dataRes)

	}

	async showFollowersAlbums({ auth, response }) {

		const dataRes = await Followers.query()
			.where({
				user_id: auth.user.id,
				type: "album"
			})
			.select([
				"id",
				"album_id",
				"type"
			])
			.with("album", (builder) => {
				builder.select([
					"id", 
					"name", 
					"photo_url", 
					"author_id"
				]).with("author", (builder) => {
					builder.select([
						"id", 
						"name"
					])
				})
			})
			.orderBy("updated_at", "desc")
			.fetch()

		response.ok(dataRes)
	}

	async showFollowersTracks({ auth, response }){

		const dataRes = await Followers.query()
			.select([
				"id",
				"track_id",
				"type",
				"created_at"
			])
			.where({
				user_id: auth.user.id,
				type: "track"
			})
			.with('track', (builder) => {
				builder
				.with('album', (builder) => {
					builder.select([ "id", "name" ])
				})
				.with('authors', (builder) => {
					builder.select([ "id", "name" ])
				})

			})
			.orderBy("created_at", "desc")
			.fetch()
		
		response.ok(dataRes)
	}

	async showFollow({ params, auth, response }){

		const data = params

		const rules = {
			id: "required|number",
			type: "required|string|in:playlist,album,author,track"
		}

		await validateAll(data, rules, Antl.list('validation'))
		.then( async () => {

			try {

				const dataQuery = {
					user_id: auth.user.id,
					type: data.type
				}
				switch (data.type) {
					case "playlist":
						dataQuery.playlist_id = data.id
						break;
					case "album":
						dataQuery.album_id = data.id
						break;
					case "author":
						dataQuery.author_id = data.id
						break;
					case "track":
						dataQuery.track_id = data.id
						break;
				
					default:
						new Error ("not found type")
						break;
				}
				
				const dataRes = await Followers.query()
					.where(dataQuery)
					.first()


				return response.ok({
					favorite: !!dataRes
				})

			} catch (error) {
				response.internalServerError()
			}

		})
		.catch( dataError => {
			response.unprocessableEntity(dataError)
		})


	}

	async createFollow({ params, auth, response }){

		const data = params

		const rules = {
			id: "required|number",
			type: "required|string|in:playlist,album,author,track"
		}

		await validateAll(data, rules, Antl.list("validation"))
		.then( async () => {

			try {

				const dataQuery = {
					album_id: null,
					author_id: null,
					playlist_id: null,
					track_id: null,
					user_id: auth.user.id,
					type: data.type
				}
				const whereObj = {
					user_id: auth.user.id,
					type: data.type
				}

				switch (data.type) {
					case "playlist":
						dataQuery.playlist_id = data.id
						whereObj.playlist_id = data.id
						break;
					case "album":
						dataQuery.album_id = data.id
						whereObj.album_id = data.id
						break;
					case "author":
						dataQuery.author_id = data.id
						whereObj.author_id = data.id
						break;
					case "track":
						dataQuery.track_id = data.id
						whereObj.track_id = data.id
						break;
				
					default:
						new Error ("not found type")
						break;
				}
				
				await Followers.findOrCreate( whereObj, dataQuery)


			} catch (error) {
				response.internalServerError()
			}

		})
		.catch( dataError => {
			response.unprocessableEntity(dataError)
		})

	}

	async deleteFollow({ params, auth, response }){

		const data = params

		const rules = {
			id: "required|number",
			type: "required|string|in:playlist,album,author,track"
		}

		await validateAll(data, rules, Antl.list("validation"))
		.then( async () => {

			try {

				const dataQuery = {
					user_id: auth.user.id,
					type: data.type
				}

				switch (data.type) {
					case "playlist":
						dataQuery.playlist_id = data.id
						break;
					case "album":
						dataQuery.album_id = data.id
						break;
					case "author":
						dataQuery.author_id = data.id
						break;
					case "track":
						dataQuery.track_id = data.id
						break;
				
					default:
						new Error ("not found type")
						break;
				}
				
				const dataRes = await Followers.query().where(dataQuery).delete()



			} catch (error) {
				response.internalServerError()
			}

		})
		.catch( dataError => {
			response.unprocessableEntity(dataError)
		})

	}

	async showFollowersTracksPlayer({ auth, response }){

		try {
			
			const dataRes = await Followers.query()
				.select([
					"track_id"
				])
				.where({
					user_id: auth.user.id,
					type: "track"
				})
				.with('track', (builder) => {
					builder
					.with('album', (builder) => {
						builder.select([ "id", "name" ])
					})
					.with('authors', (builder) => {
						builder.select([ "id", "name" ])
					})
				})
				.orderBy("created_at", "desc")
				.fetch()

			response.ok({
				id: 0,
				name: "favorite",
				tracks: dataRes.rows.map( row => (row.toJSON().track) )
			})

		} catch (error) {
			response.internalServerError()
		}

	}


}

module.exports = MeController
