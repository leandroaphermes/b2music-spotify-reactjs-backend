'use strict'

const { validateAll, validations, extend } = use('indicative/validator')
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


const Hash = use('Hash')

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
			truename: "required|min:4|max:100",
			phone: "required|min:7|max:20",
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
			truename: "trim|lower_case",
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
				response.internalServerError()
			}

		})
		.catch(dataError => {
			console.log("Error Validate", dataError)
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
				validations.regex([/[a-zA-Z0-9!@#$%&\-_.]/])
			],
			password_new: [
				validations.required(),
				validations.min([6]),
				validations.max([32]),
				validations.regex([/[a-zA-Z0-9!@#$%&\-_.]/]),
				validations.confirmed()
			]
		}

		await validateAll(data, rules, Antl.list("validation"))
		.then( async () => {
			
			try {

				const user = await User.findOrFail(auth.user.id)
	
				const validedPassOld = await Hash.verify(data.password_old, user.password )
	
				if(!validedPassOld){
					return response.forbidden({
						message: Antl.formatMessage("users.passwordOldValidFailed")
					})
				}
	
				user.merge({
					password: data.password_new
				})
				user.save()

				
			} catch (error) {
                console.log(error)
				response.internalServerError()
			}

		})
		.catch( dataError => {
			console.log("Validation: ", dataError)
			response.unprocessableEntity(dataError)
		})

	}

  async showFollowersPlaylists({ auth, response }) {

    const datRes = await Followers.query()
      .where({ 
        user_id: auth.user.id,
        type: 'playlist',
       })
      .with('playlist', (builder) => {
        builder.select([ "id", "name", "description", "photo_url" ])
      })
      .orderBy('created_at', 'desc')
      .fetch()

    response.ok(datRes)

  }
	
	async homePage({ auth, response }){
		try {
			const dataRes = {

				cards: await Card.query().with('playlists', (builder) =>{
					builder.select([ "id", "name", "description", "photo_url" ])
				} ).fetch(),

				playlist_histories: await PlaylistHistory.query().where({ user_id: auth.user.id }).with('playlists', (builder) => {
					builder.select([ "id", "name", "description", "photo_url" ])
				} ).orderBy("updated_at", "desc").fetch()

			}
			return dataRes
		} catch (error) {
			console.log(error)
			response.internalServerError()
		}
	}
}

module.exports = MeController
