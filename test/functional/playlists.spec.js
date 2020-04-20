'use strict'

const { test, trait } = use('Test/Suite')('Playlist')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')

test('Listando todas as Playlist', async ({ assert, client }) => {

    const { id: user_id } = await Factory.model('App/Models/User').create({
        password: "123456"
    })
    await Factory.model('App/Models/Playlist').create({
        user_id
    })

    const response = await client.get('/playlists').end()

    response.assertStatus(200)
    assert.isArray(response.body)
    assert.isNotEmpty(response.body)

})

test('Criando uma Playlist na tabela Playlists', async ({ assert, client }) => {

  const { id: factoryUser_id } = await Factory.model('App/Models/User').create({
      password: "123456"
  })
  const { user_id, name, description } = await Factory.model('App/Models/Playlist').make({
    user_id: factoryUser_id
  })

  const response = await client.post('/playlists').send({ user_id, name, description }).end()

  response.assertStatus(201)
  assert.isObject(response.body)

})
