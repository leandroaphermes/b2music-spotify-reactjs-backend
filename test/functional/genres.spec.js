'use strict'

const { test, trait } = use('Test/Suite')('Genres')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}

test('Listando os Generos', async ({ assert, client }) => {

  await Factory.model('App/Models/Genre').create()

  const response = await client.get('/genres')
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
})

test('Criando um Genero na tabela Genres', async ({ assert, client }) => {

  const { name, description } = await Factory.model('App/Models/Genre').make()

  const response = await client.post('/genres')
    .send({ name, description })
    .loginVia( await getUser(), 'jwt' )
    .end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.exists(response.body.id)
  assert.exists(response.body.name)

})
