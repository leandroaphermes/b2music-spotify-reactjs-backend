'use strict'

const { test, trait } = use('Test/Suite')('')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}
 
test('Trazendo todos os Cards de Playlists', async ({ assert, client }) => {

/*     const user = await getUser()

    await Factory.model('App/Models/Playlist').create({
      user_id: user.id
    })

    const response = await client.get('/playlists')
      .loginVia( user , 'jwt')
      .end()

    response.assertStatus(200)
    assert.isArray(response.body)
    assert.isNotEmpty(response.body)
 */
}).timeout(6000)
