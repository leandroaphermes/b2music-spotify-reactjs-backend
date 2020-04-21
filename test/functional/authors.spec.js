'use strict'

const { test, trait } = use('Test/Suite')('Author')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}

test('Listando Artistas', async ({ assert, client }) => {

  await Factory.model('App/Models/Author').create()

  const response = await client.get('/authors')
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
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
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    name,
    site
  })
})

test('Pegando um Artista via ID', async ({ assert, client }) => {

  const { id } = await Factory.model('App/Models/Author').create()

  const response = await client.get(`/authors/${id}`)
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')
})