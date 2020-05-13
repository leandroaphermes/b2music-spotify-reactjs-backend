'use strict'

const { test, trait } = use('Test/Suite')('User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('Auth/Client')

async function getUser(data = {}){
  const user = await Factory.model('App/Models/User').create(data)
  return user
}

test('Listando Usuarios', async ({ assert, client }) => {

  const response = await client.get('/users')
    .loginVia( await getUser(), 'jwt')
    .end()

  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
})

test('Criando Usuario', async ({ assert, client }) => {

  const {
    username,
    email,
    truename,
    password,
    password_confirmation,
    phone,
    gender,
    birth,
    country,
    province
  } = await Factory.model('App/Models/User').make({
    password: '123123',
    password_confirmation: '123123',
  })

  const response = await client.post('/register')
  .send({
    username,
    email,
    truename,
    password,
    password_confirmation,
    phone,
    gender,
    birth,
    country,
    province
  })
  .end()

  response.assertStatus(201)
  assert.isObject(response.body)
  assert.exists(response.body.id)
  assert.exists(response.body.email)
})

test('Fazendo login de Usuario comum', async ({ assert, client }) => {

  const { email } = await Factory.model('App/Models/User').create({
    password: '123123'
  })

  const response = await client.post('/auth')
  .send({ email, password:'123123' })
  .end()
  
  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.token, 'Not exist Token')

})

test('Pegando o Usuario via ID', async ({ assert, client }) => {

  const user = await getUser()

  const response = await client.get(`/users/${user.id}`)
    .loginVia( user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.email, 'Not exist\'s email')
  assert.exists(response.body.truename, 'Not exist\'s truename')
})
 
test('Pegando dados do usuario autenticado', async({ assert, client }) => {

  const user = await getUser()

  const response = await client.get('/users/current-auth')
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
    username: "leandro5654",
    phone: user.phone,
    province: user.province,
    country: user.country,
    birth: "2000-01-01",
    gender: user.gender,
    email: user.email
  }

  const response = await client.put(`/users/${user.id}`)
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

  const response = await client.put(`/users/${user.id}/password`)
    .send({
      password_old: "@123123",
      password_new: "@123123",
      password_new_confirmation: "@123123"
    })
    .loginVia( user, 'jwt')
    .end()

  response.assertStatus(204)

})