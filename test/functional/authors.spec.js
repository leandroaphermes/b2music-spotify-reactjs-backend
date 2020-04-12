'use strict'

const { test, trait } = use('Test/Suite')('Author')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Author = use('App/Models/Author');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')

test('Listando Artistas', async ({ assert, client }) => {

  const response = await client.get('/authors').end()

  response.assertStatus(200)
  assert.isArray(response.body)
})

test('Criando um Artista na tabela de Author', async ({ client }) => {

  const {
    name, 
    photo_url,
    bio,
    site,
    wikipedia,
    instagram,
    twitter,
    facebook
  } = await Factory.model('App/Models/Author').make()

  
  const response = await client.post('/authors')
  .send({
    name, 
    photo_url,
    bio,
    site,
    wikipedia,
    instagram,
    twitter,
    facebook
  })
  .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    name,
    site
  })
})
