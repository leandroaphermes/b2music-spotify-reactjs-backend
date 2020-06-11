'use strict'
const Env = use('Env')
const { test, trait } = use('Test/Suite')('Search')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}

test('Procurando tudo', async ({ assert, client }) => {

	const search = "da"

	const response = await client.get(`${Env.get('PREFIX_ROUTER')}/search/${search}`)
    .loginVia( await getUser(), 'jwt')
    .end()
  
  response.assertStatus(200)
  assert.isObject(response.body)
  
  assert.isObject(response.body.tracks)
  assert.isArray(response.body.tracks.data)

  assert.isObject(response.body.playlists)
  assert.isArray(response.body.playlists.data)

  assert.isObject(response.body.authors)
  assert.isArray(response.body.authors.data)

  assert.isObject(response.body.albums)
  assert.isArray(response.body.albums.data)

  assert.isObject(response.body.users)
  assert.isArray(response.body.users.data)

})