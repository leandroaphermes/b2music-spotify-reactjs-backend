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

}).timeout(6000)

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

test('Adicionando Track em uma Playlist', async ({ assert, client }) => {

  const user = await getUser()

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id,
    categories: 'single'
  })

  const track = await Factory.model('App/Models/Track').create({
    album_id: factoryAlbum_id
  })
  await track.authors().attach([ factoryAuthor_id ])

  const playlist = await Factory.model('App/Models/Playlist').create({
    user_id: user.id
  })

  const response = await client.post(`/playlists/${playlist.id}/track/${track.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
  assert.notExists(response.body.message)

}).timeout(6000)

test('Removendo Track em uma Playlist', async ({ assert, client }) => {

  const user = await getUser()

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id,
    categories: 'single'
  })

  const track = await Factory.model('App/Models/Track').create({
    album_id: factoryAlbum_id
  })
  await track.authors().attach([ factoryAuthor_id ])

  const playlist = await Factory.model('App/Models/Playlist').create({
    user_id: user.id
  })
  await playlist.tracks().attach(track.id)

  const response = await client.delete(`/playlists/${playlist.id}/track/${track.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
  assert.notExists(response.body.message)

}).timeout(6000)

test('Editar Playlist via ID', async ({ assert, client }) => {

  const user = await getUser()

  const playlist = await Factory.model("App/Models/Playlist").create({
    user_id: user.id
  })

  const response = await client.put(`/playlists/${playlist.id}`)
    .loginVia( user, "jwt")
    .send({
      name: "Sou um novo titulo para playlist",
      description: "Só uma descrição"
    })
    .end()
  
  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id)
  assert.equal(response.body.id , playlist.id)
  assert.exists(response.body.user_id)
  assert.equal(response.body.user_id , playlist.user_id)
  assert.exists(response.body.name)
  assert.equal(response.body.name , "Sou um novo titulo para playlist")

}).timeout(6000)