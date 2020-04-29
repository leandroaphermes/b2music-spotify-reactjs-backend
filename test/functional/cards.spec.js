'use strict'

const { test, trait } = use('Test/Suite')('Cards')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}

test('Listando todos os Cards', async ({ assert, client }) => {

  await Factory.model('App/Models/Card').create()


  const response = await client.get('/cards')
    .loginVia( await getUser(), 'jwt' )
    .end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)

})

test('Criando um Card da tabela Cards', async ({ assert, client }) => {

  const { title, description } = await Factory.model('App/Models/Card').make()

  const response = await client.post('/cards')
    .send({ title, description })
    .loginVia(await getUser(), 'jwt')
    .end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.exists(response.body.id)
  assert.exists(response.body.title)

})

test('Listando Cards para Home Page', async ({ assert, client }) => {

  await Factory.model('App/Models/Card').create()

  const response = await client.get('/cards/home-page')
    .loginVia( await getUser(), "jwt")
    .end()

  response.assertStatus(200)

  assert.isArray(response.body)
  assert.isNotEmpty(response.body)

})

test('Adicionando Playlist nos Cards', async ({ assert, client }) => {

  const user = await getUser()

  const { id: factoryCardID } = await Factory.model('App/Models/Card').create()
  const { id: factoryPlaylistID } = await Factory.model('App/Models/Playlist').create({
    user_id: user.id
  })

  const response = await client.post(`/cards/${factoryCardID}/playlist/${factoryPlaylistID}`)
    .loginVia(user, "jwt")
    .end()
  
  response.assertStatus(204)
  assert.notExists(response.body.message)

})