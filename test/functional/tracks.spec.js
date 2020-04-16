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

    const data = await Factory.model('App/Models/Track').create({
        album_id: factoryAlbum_id
    })

})