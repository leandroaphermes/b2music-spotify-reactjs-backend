'use strict'

const { validateAll, validations } = use('indicative/validator')
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

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
			phone: "required|min:14|max:20",
			gender: "required|alpha|in:F,M",
			birth: [
			  validations.required(),
			  validations.dateFormat(['YYYY-MM-DD']),
			  validations.date()
			],
			country: [
				validations.required(),
				validations.min([3]),
				validations.max([50]),
				validations.regex(["[a-zA-Z\s]+"])
			],
			province: "required|alpha|min:2|max:5"
		}
		const sintatization = {
			username: "trim|lower_case",
			email: "trim|lower_case|normalize_email",
			truename: "trim|lower_case",
			phone: "trim|lower_case",
			gender: "trim|upper_case",
			country: "trim|lower_case",
			province: "trim|lower_case"
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
}

module.exports = UserController
