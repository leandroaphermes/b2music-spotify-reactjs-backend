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

Factory.blueprint('App/Models/User', (faker, i, data = { }) => {
    return {
        username: faker.username(),
        email: faker.email(),
        truename: faker.name(),
        phone: faker.phone(),
        gender: faker.string({ pool: 'MF', length: 1 }),
        birth: '2020-12-30',
        country: faker.country({ full: true }),
        province: faker.province(),
        ...data
    }
}) 

Factory.blueprint('App/Models/Author', (faker) => {
    let nickname = faker.username()
    return {
        name: faker.name(),
        photo_url: `${faker.avatar({protocol: 'https', fileExtension: 'jpg' })}?s=320`,
        bio: faker.paragraph({ sentences: 1 }),
        site: faker.url({protocol: 'https' }),
        wikipedia: faker.url({domain: 'pt.wikipedia.org', protocol: 'https' }),
        instagram: nickname,
        twitter: nickname,
        facebook: nickname
    }
})

Factory.blueprint('App/Models/Album', (faker, i , data = { }) => {
    return {
        categories: faker.pickone(['single', 'ep', 'album']),
        name: faker.name(),
        photo_url: `${faker.avatar({protocol: 'https', fileExtension: 'jpg' })}?s=320`,
        releasedt: '2020-01-30',
        ...data
    }
})

Factory.blueprint('App/Models/Genre', (faker, i , data = { }) => {
    return {
        name: faker.name(),
        description: faker.paragraph({ sentences: 1 }),
    }
})

Factory.blueprint('App/Models/Track', (faker, i , data = { }) => {
    return {
        name: faker.name(),
        src: `track-${faker.timestamp()}.mp3`,
        duration: faker.integer({ min: 60, max: 600 }),
        playcount: 0,
        ...data
    }
})
