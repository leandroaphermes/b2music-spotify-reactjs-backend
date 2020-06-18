'use strict'
const Env = use('Env')
const { test, trait } = use('Test/Suite')('Me')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(data = {}){
  const user = await Factory.model('App/Models/User').create(data)
  return user
}


test('Listando Cards para Home Page do usuario autenticado', async ({ assert, client }) => {

  await Factory.model('App/Models/Card').create()

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me/home-page`)
    .loginVia( await getUser(), "jwt")
    .end()

  response.assertStatus(200)

  assert.isObject(response.body)
  assert.isNotEmpty(response.body.cards)
  assert.isArray(response.body.playlist_histories)

})

test('Pegando dados do usuario autenticado', async({ assert, client }) => {

  const user = await getUser()
  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me`)
      .loginVia(user, 'jwt')
      .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.email)

})

test('Atualizando dados de usuario autenticado', async ({ assert, client }) => {

  const user = await getUser()

  const update = {
    truename: "Leandro Hermes",
    phone: user.phone,
    province: user.province,
    country: user.country,
    birth: "2000-01-01",
    gender: user.gender,
    email: user.email
  }

  const response = await client.put(`${Env.get('PREFIX_ROUTER')}/me`)
    .send(update)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id)
  assert.exists(response.body.email)
  
})

test('Alterando senha de usuario autenticado', async ({ client }) => {

  const user = await getUser({
    password: "@123123"
  })

  const response = await client.put(`${Env.get('PREFIX_ROUTER')}/me/password`)
    .send({
      password_old: "@123123",
      password_new: "@123123",
      password_new_confirmation: "@123123"
    })
    .loginVia( user, 'jwt')
    .end()

  response.assertStatus(204)

})

test('Listando todas as Playlists que o usuario autenticado esta seguindo', async ({ assert, client }) => {

  const user = await getUser()

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me/playlists`)
    .loginVia( user, 'jwt')
    .end()


})

test('Listando todas as Autores que o usuario autenticado esta seguindo', async ({ assert, client }) => {

  const user = await getUser()

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me/authors`)
    .loginVia( user, 'jwt')
    .end()


})

test('Listando todas as Albums que o usuario autenticado esta seguindo', async ({ assert, client }) => {

  const user = await getUser()

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me/albums`)
    .loginVia( user, 'jwt')
    .end()


})

test('Varificando se a playlist ou album esta sendo seguido', async ({ assert, client }) => {

  const user = await getUser()

  const id = 1

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me/favorites/${id}/playlist`)
    .loginVia( user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.exists(response.body.favorite)
  assert.isBol

})

test('Lista de musicas favoritas para o player', async ({ assert, client }) => {

  const user = await getUser()

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/me/favorites-player`)
    .loginVia( user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject( response.body )
  assert.exists( response.body.id )
  assert.exists( response.body.tracks )
  assert.isArray( response.body.tracks )

})