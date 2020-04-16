'use strict'

const { test, trait } = use('Test/Suite')('Album')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')

test('Listando Albums', async ({ assert, client }) => {

  const { id: factoryGenre_id } = await Factory.model('App/Models/Genre').create()
  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  
  await Factory.model('App/Models/Album').create({
    genre_id: factoryGenre_id,
    author_id: factoryAuthor_id
  })
  
  const response = await client.get('/albums').end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
})

test('Criando um Album na tabela de Album', async ({ client }) => {

  const { id: factoryGenre_id } = await Factory.model('App/Models/Genre').create()
  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  
  const { 
    author_id, 
    genre_id,
    name,
    categories,
    releasedt,
    photo_url
   } = await Factory.model('App/Models/Album').make({
    genre_id: factoryGenre_id,
    author_id: factoryAuthor_id
  })
  
  const response = await client.post('/albums')
  .send({ 
    author_id, 
    genre_id,
    name,
    categories,
    releasedt,
    photo_url
   })
  .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    genre_id,
    author_id
  })
})

test('Pegando Album via ID', async ({ assert, client }) => {

  const { id: factoryGenre_id } = await Factory.model('App/Models/Genre').create()
  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  
  const { id } = await Factory.model('App/Models/Album').create({
    genre_id: factoryGenre_id,
    author_id: factoryAuthor_id
  })

  const response = await client.get(`/albums/id/${id}`).end()

  
  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')

})
