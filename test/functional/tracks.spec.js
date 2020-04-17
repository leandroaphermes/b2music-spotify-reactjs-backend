'use strict'

const { test, trait } = use('Test/Suite')('Track')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')

test('Listando todas as Tacks', async ({ assert, client }) => {

    const { id: factoryGenre_id } = await Factory.model('App/Models/Genre').create()
    const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
    const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
      genre_id: factoryGenre_id,
      author_id: factoryAuthor_id,
      categories: 'single'
    })

    await Factory.model('App/Models/Track').create({
        album_id: factoryAlbum_id
    })

    const response = await client.get('/tracks').end()

    response.assertStatus(200)
    assert.isArray(response.body)
    assert.isNotEmpty(response.body)
})

test('Criando uma Track na tabela track', async ({ assert, client }) => {

  const { id: factoryGenre_id } = await Factory.model('App/Models/Genre').create()
  const { id: factoryAuthor_id } = await Factory.model('App/Models/Author').create()
  const { id: factoryAlbum_id } = await Factory.model('App/Models/Album').create({
    genre_id: factoryGenre_id,
    author_id: factoryAuthor_id,
    categories: 'single'
  })

  const { name, album_id, authors_id, src, duration, playcount } = await Factory.model('App/Models/Track').make({
      album_id: factoryAlbum_id,
      authors_id: [
        {
          id: factoryAuthor_id
        }
      ]
  })

  const response = await client.post('/tracks').send({ name, album_id, authors_id, src, duration, playcount }).end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.isNumber(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.name, 'Not exist\'s name')
  assert.isNumber(response.body.album_id, 'Not exist\'s album_id')

})