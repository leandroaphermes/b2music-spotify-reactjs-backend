'use strict'

const { test, trait } = use('Test/Suite')('Playlist')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}
 
test('Listando todas as Playlist', async ({ assert, client }) => {

    const user = await getUser()

    await Factory.model('App/Models/Playlist').create({
      user_id: user.id
    })

    const response = await client.get('/playlists')
      .loginVia( user , 'jwt')
      .end()

    response.assertStatus(200)
    assert.isArray(response.body)
    assert.isNotEmpty(response.body)

})

test('Criando uma Playlist na tabela Playlists', async ({ assert, client }) => {

  const user = await getUser()

  const { user_id, name, description } = await Factory.model('App/Models/Playlist').make({
    user_id: user.id
  })

  const response = await client.post('/playlists').send({ user_id, name, description })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.isNumber(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')

})

test('Pegando uma Playlist via ID', async ({ assert, client }) => {

  const user = await getUser()

  const { id } = await Factory.model('App/Models/Playlist').create({
    user_id: user.id
  })

  const response = await client.get(`/playlists/${id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.isNumber(response.body.id)
  assert.exists(response.body.name)

})
