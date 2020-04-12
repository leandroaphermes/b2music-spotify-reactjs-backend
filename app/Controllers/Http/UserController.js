'use strict'

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
		
		delete data.password_confirmation
		const dataRes = await User.create(data)
		response.status(201).send(dataRes)
	}
}

module.exports = UserController
