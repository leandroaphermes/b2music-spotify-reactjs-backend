'use strict'

const { validateAll, validations } = use('indicative/validator')
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class UserController {

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
			country: "required|alpha|min:4|max:20",
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

			sanitize(data, sintatization)

			delete data.password_confirmation
			const dataRes = await User.create(data)
			response.status(201).send(dataRes)

		})
		.catch( (dataError) => {
			response.status(422).send(dataError)
		})

	}
}

module.exports = UserController
