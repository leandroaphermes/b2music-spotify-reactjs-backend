'use strict'

const { validateAll, validations, extend } = use('indicative/validator')
const { sanitize } = use('indicative/sanitizer')
const Antl = use('Antl')

const uniqueValidation = use("App/Validations/Extends/unique.js")

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

const NotFoundException = use('App/Exceptions/NotFoundException')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

const { ALFA_NUMBER_SPACE_CS, 
				PHONE_VALIDATION, 
				PASSWORD_VALIDATION, 
				USERNAME_VALIDATION
			} = require('../../../config/const-regex')
const { ModelNotFoundException } = require('@adonisjs/lucid/src/Exceptions')

const Env = use('Env')
const Hash = use('Hash')
const Helpers = use('Helpers')

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
				const authRes = await auth.attempt(data.email, data.password, false)

				const result = {
					token: authRes.token,
					refreshToken: authRes.refreshToken,
					id: user.id,
					email: user.email,
					username: user.username,
					truename: user.truename,
					photo_url: user.toObject().photo_url
				}

				response.ok(result)
			} catch (error) {
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

		extend('unique', uniqueValidation)

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
			username: [
				validations.required(),
				validations.alpha_numeric(),
				validations.min([4]),
				validations.max([32]),
				validations.unique([ 'users', 'username' ]),
				validations.regex([ USERNAME_VALIDATION ]),
			],
			email: "required|email|min:6|max:64|unique:users,email",
			password: [
				validations.required(),
				validations.min([4]),
				validations.max([32]),
				validations.confirmed(),
				validations.regex([ PASSWORD_VALIDATION ]),
			],
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
			truename: "trim",
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
				await User.create(data)
				response.created()

			} catch (error) {
				response.internalServerError()
			}
		})
		.catch( (dataError) => {
			response.unprocessableEntity(dataError)
		})

	}

	async show({ request, response }){

		const data = request.params
		const rules = {
			username: "required|alpha_numeric|min:3|max:32"
		}
		await validateAll(data, rules, Antl.list('validation'))
		.then( async () => {
			try {
				
				const dataRes = await User.query()
					.where({
						username: data.username
					})
					.setHidden([
						"password",
						"phone",
						"birth"
					])
					.with('playlists')
					.first()

				if(!dataRes) throw new NotFoundException(Antl.formatMessage('user.notFound'))

				response.ok(dataRes)
			} catch (error) {
				if(error instanceof NotFoundException){
					response.notFound({
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

	async update({ request, auth, response }){

		extend('unique', uniqueValidation)
		
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
			username: [
				validations.required(),
				validations.alpha_numeric(),
				validations.min([4]),
				validations.max([32]),
				validations.unique([ 'users', 'username' ]),
				validations.regex([ USERNAME_VALIDATION ]),
			],
			email: "required|email|min:6|max:64|unique:users,email",
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
			truename: "trim",
			phone: "trim|lower_case",
			gender: "trim|upper_case",
			country: "trim|upper_case",
			province: "trim|upper_case"
		}

		await validateAll(data, rules, Antl.list('validation'))
		.then( async () => {

			try {

				const user = await User.findOrFail(data.id)

				if(user.id !== auth.user.id) throw new ForbiddenException(Antl.formatMessage('users.userBadPerssionSave'))

				sanitize(data, sintatization)

				user.merge(data)
				await user.save()

				response.ok(user)

			} catch (error) {
				if(error instanceof ForbiddenException){
					response.forbidden({
						message: error.message
					})
				}else if(error instanceof ModelNotFoundException){
					response.notFound({
						message: Antl.formatMessage('user.notFound')
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

	async updatePasswordAuth({ request, auth, response }){

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
				

				if(!validedPassOld) throw new ForbiddenException(Antl.formatMessage("user.passwordOldValidFailed"))
	
				user.merge({
					password: data.password_new
				})
				user.save()

				
			} catch (error) {
				if(error instanceof ForbiddenException){
					response.forbidden({
						message: error.message
					})
				}else if(error instanceof ModelNotFoundException){
					response.notFound({
						message: Antl.formatMessage('user.notFound')
					})
				}else{
					response.internalServerError()
				}
			}

		})
		.catch( dataError => {
			console.log("Validation: ", dataError)
			response.unprocessableEntity(dataError)
		})

	}

	fileImage({ params, response }){

		if(params.file === ""){
			return ""
		}

		return response.download(Helpers.tmpPath(`${Env.get('STORAGE_FILLES')}/images/users/${params.file}`))

	}
}

module.exports = UserController
