'use strict'

const { test, trait } = use('Test/Suite')('Track')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}

test('Listando todas as Tracks', async ({ assert, client }) => {

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id,
    categories: 'single'
  })

  const track = await Factory.model('App/Models/Track').create({
    album_id: factoryAlbum_id
  })
  await track.authors().attach([ factoryAuthor_id ])

  const response = await client.get('/tracks')
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
}).timeout(6000)

test('Criando uma Track na tabela track', async ({ assert, client }) => {

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id,
    categories: 'single'
  })

  const { name, album_id, src, duration, playcount } = await Factory.model('App/Models/Track').make({
    album_id: factoryAlbum_id,
  })

  const response = await client.post('/tracks')
    .send({ 
      name, 
      album_id, 
      authors: [ factoryAuthor_id ], 
      src, 
      duration, 
      playcount
    })
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.isNumber(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')
  assert.isNumber(response.body.album_id, 'Not exist\'s album_id')

}).timeout(6000)

test('Pegando uma Track via ID', async ({ assert, client }) => {

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id,
    categories: 'single'
  })

  const track = await Factory.model('App/Models/Track').create({
    album_id: factoryAlbum_id
  })
  await track.authors().attach([ factoryAuthor_id ])

  const response = await client.get(`/tracks/${track.id}`)
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.isNumber(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')

}).timeout(6000)