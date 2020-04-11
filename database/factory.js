'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/* Factory.blueprint('App/Models/User', (faker) => {
    return {
        username: faker.username(),
        email: faker.email(),
        password: '123123',
        password_confirmation: '123123',
        truename: faker.name(),
        phone: faker.phone(),
        gender: faker.string({ pool: 'MF', length: 1 }),
        birth: '2020-12-30',
        country: faker.country({ full: true }),
        province: faker.province()
    }
}) */

Factory.blueprint('App/Models/Author', (faker) => {
    let nickname = faker.username()
    return {
        name: faker.name(),
        photo_url: `${faker.avatar({protocol: 'https', fileExtension: 'jpg' })}?s=320`,
        bio: faker.paragraph(),
        site: faker.domain(),
        wiki: faker.domain(),
        instagram: nickname,
        twitter: nickname,
        facebook: nickname
    }
})
