'use strict'

const { test, trait } = use('Test/Suite')('Album')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(){
  const user = await Factory.model('App/Models/User').create()
  return user
}


test('Listando Albums', async ({ assert, client }) => {

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  
  await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id
  })
  
  const response = await client.get('/albums')
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
}).timeout(6000)

test('Criando um Album na tabela de Album', async ({ assert, client }) => {

  const { id: factoryGenre_id } = await Factory.model('App/Models/Genre').create()
  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  
  const { 
    author_id, 
    name,
    categories,
    releasedt,
    photo_url
   } = await Factory.model('App/Models/Album').make({
    author_id: factoryAuthor_id
  })

  
  const response = await client.post('/albums')
    .send({ 
      author_id, 
      genres: [ factoryGenre_id ],
      name,
      categories,
      releasedt,
      photo_url
    })
    .loginVia( await getUser() , 'jwt')
    .end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')
}).timeout(6000)

test('Pegando Album via ID', async ({ assert, client }) => {

  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  
  const { id } = await Factory.model('App/Models/Album').create({
    author_id: factoryAuthor_id
  })

  const response = await client.get(`/albums/${id}`)
    .loginVia( await getUser() , 'jwt')
    .end()

  
  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')

}).timeout(6000)
