'use strict'

const { test, trait } = use('Test/Suite')('User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')

test('Listando Usuarios', async ({ assert, client }) => {

  await Factory.model('App/Models/User').create({
    password: '123123',
  })

  const response = await client.get('/users').end()


  response.assertStatus(200)
  assert.isArray(response.body)
  assert.isNotEmpty(response.body)
})

test('Criando Usuario', async ({ client }) => {

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

  const response = await client.post('/users')
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
  response.assertJSONSubset({
    username,
    email
  })
})

test('Pegando o Usuario via ID', async ({ assert, client }) => {

  const { id } = await Factory.model('App/Models/User').create({
    password: '123123',
  })

  const response = await client.get(`/users/${id}`).end()

  response.assertStatus(200)
  assert.isObject(response.body)
  assert.exists(response.body.id, 'Not exist\'s id')
  assert.exists(response.body.email, 'Not exist\'s email')
  assert.exists(response.body.truename, 'Not exist\'s truename')
})

