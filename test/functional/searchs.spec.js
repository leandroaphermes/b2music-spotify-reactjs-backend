'use strict'

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

	const response = await client.get(`/search/${search}`)
    .loginVia( await getUser(), 'jwt')
    .end()
  
  response.assertStatus(200)
  assert.isObject(response.body)
  assert.isArray(response.body.tracks)
  assert.isArray(response.body.playlists)
  assert.isArray(response.body.authors)
  assert.isArray(response.body.albums)
  assert.isArray(response.body.users)

})