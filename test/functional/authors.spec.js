'use strict'

const { test, trait } = use('Test/Suite')('Authors')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Authors = use('App/Models/Authors');

trait('Test/ApiClient')

test('Criando um Artista na tabela de Authors', async ({ client }) => {

/*   const user = {
    username: 'leandro',
    email: 'leandro@leandro.com',
    password: '123123',
    password_confirmation: '123123',
    truename: 'leandro hermes',
    phone: '(99) 99999-9999',
    gender: 'M',
    birth: '2020-12-30',
    country: 'brazil',
    province: 'mt'
  }

  const response = await client.post('/users')
  .send(user)
  .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    username: user.username,
    email: user.email,
    truename: user.truename
  }) */
})
