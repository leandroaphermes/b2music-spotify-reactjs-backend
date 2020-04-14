'use strict'

const { test, trait } = use('Test/Suite')('Users')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

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
  assert.lengthOf(response.body, 1)
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
