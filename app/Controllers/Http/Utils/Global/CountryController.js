'use strict'

const fs = require('fs')
const Helpers = use('Helpers')

class CountryController {

    async index( { response }){
        const data =  await fs.readFileSync(Helpers.resourcesPath("countrys-and-provinces-json/all-countrys.json"))
        return response.ok(data)
    }

    async show({ request, response }){
        const data = await fs.readFileSync(Helpers.resourcesPath("countrys-and-provinces-json/all-provinces.json"))
        const dataParse = JSON.parse(data)
        let dataRes = dataParse.filter(  provinces => provinces.country_code === request.params.country_code )
        response.ok(dataRes) 
    }

}

module.exports = CountryController
