'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Author = use('App/Models/Author');

class AuthorController {

    async index(){
        const data = await Author.all()
        return data
    }

    async store({ request, response }){
        
        const data = request.only([ 
            "name",
            "photo_url",
            "bio",
            "site",
            "wikipedia",
            "instagram",
            "twitter",
            "facebook"
        ])
        const dataRes = await Author.create(data)
        response.status(201).send(dataRes)
        return data 
    }

}

module.exports = AuthorController
