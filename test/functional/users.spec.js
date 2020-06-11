'use strict'
const Env = use('Env')
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

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/users`)
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

  const response = await client.post(`${Env.get('PREFIX_ROUTER')}/register`)
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

  const response = await client.post(`${Env.get('PREFIX_ROUTER')}/auth`)
  .send({ email, password:'123123' })
  .end()
  
  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.token, 'Not exist Token')

})

test('Pegando o Usuario via ID', async ({ assert, client }) => {

  const user = await getUser()

  const response = await client.get(`${Env.get('PREFIX_ROUTER')}/users/${user.id}`)
    .loginVia( user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.email, 'Not exist\'s email')
  assert.exists(response.body.truename, 'Not exist\'s truename')
})
 