'use strict'

const { validateAll, validations } = use('indicative/validator')
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

const Hash = use('Hash')

class UserController {

	async auth ({ request, auth, response }){

		const data = request.only([
			"email", "password"
		])

		const rules = {
			email: "required|email|min:6|max:64",
			password: "required|string|min:4|max:32"
		}

		await validateAll(data, rules, Antl.list('validator'))
		.then( async () => {
			try {
				const user = await User.findByOrFail('email', data.email)
				const authRes = await auth.attempt(data.email, data.password, true)

				const result = {
					token: authRes.token,
					refreshToken: authRes.refreshToken,
					id: user.id,
					email: user.email,
					username: user.username,
					truename: user.truename
				}

				response.ok(result)
			} catch (error) {
				console.log(error);
				
				response.status(400).send({
					message: Antl.formatMessage('authentication.incorrectEmailOrPassword')
				})
			}
		})
		.catch( dataError => {
			response.unprocessableEntity(dataError)
		})

	}

	async index (){
		const data = await User.all()
		return data
	}

	async store ({ request, response }){
		let data = request.only([
			"username",
			"email",
			"password",
			"password_confirmation",
			"truename",
			"phone",
			"gender",
			"birth",
			"country",
			"province"
		])


		const rules = {
			username: "required|alpha_numeric|min:4|max:32",
			email: "required|email|min:6|max:64",
			password: "required|confirmed|min:4|max:32",
			truename: "required|min:4|max:100",
			phone: "required|min:7|max:20",
			gender: "required|alpha|in:F,M,O",
			birth: [
			  validations.required(),
			  validations.dateFormat(['YYYY-MM-DD']),
			  validations.date()
			],
			country: "required|alpha|min:2|max:3",
			province: "required|alpha|min:2|max:3"
		}
		const sintatization = {
			username: "trim|lower_case",
			email: "trim|lower_case|normalize_email",
			truename: "trim|lower_case",
			phone: "trim|lower_case",
			gender: "trim|upper_case",
			country: "trim|upper_case",
			province: "trim|upper_case"
		}

		await validateAll(data, rules, Antl.list('validation'))
		.then( async () => {
			try {
				
				sanitize(data, sintatization)

				delete data.password_confirmation
				const dataRes = await User.create(data)
				response.created(dataRes)

			} catch (error) {
				response.internalServerError()
			}
		})
		.catch( (dataError) => {
            console.error("Erro Usuario: ", dataError)
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
				
				const dataRes = await User.findOrFail(data.id)
				response.ok(dataRes)
			} catch (error) {
				response.internalServerError()
			}
		})
		.catch( dataError => {
			console.error("Erro Usuario: ", dataError);
			response.unprocessableEntity(dataError)
		})

	}

	async showAuth({ auth, response }){

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
			"username",
			"email",
			"truename",
			"phone",
			"gender",
			"birth",
			"country",
			"province"
		])
		
		data.id = request.params.id
		
		const rules = {
			id: "required|number",
			username: "required|alpha_numeric|min:4|max:32",
			email: "required|email|min:6|max:64",
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
			username: "trim|lower_case",
			email: "trim|lower_case|normalize_email",
			truename: "trim|lower_case",
			phone: "trim|lower_case",
			gender: "trim|upper_case",
			country: "trim|upper_case",
			province: "trim|upper_case"
		}

		await validateAll(data, rules, Antl.list('validation'))
		.then( async () => {

			try {

				const user = await User.findOrFail(data.id)

				if(user.id !== auth.user.id) {
					return response.forbidden({
						message: Antl.formatMessage('users.userBadPerssionSave')
					})
				}

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

	async updatePassword( { request, auth, response }){

		const data = request.only([ 
			"password_old",
			"password_new",
			"password_new_confirmation",
		])
		data.id = request.params.id

		const rules = {
			id: "required|number",
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

				if(data.id !== auth.user.id){
					return response.forbidden({
						message: Antl.formatMessage("users.userBadPerssionSave")
					})
				}
	
				const user = await User.findOrFail(data.id)
	
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
}

module.exports = UserController
