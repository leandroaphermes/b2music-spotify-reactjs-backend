'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/users', 'UserController.index')
Route.post('/users', 'UserController.store')
Route.get('/users/id/:id', 'UserController.show')


Route.get('/authors', 'AuthorController.index')
Route.post('/authors', 'AuthorController.store')
Route.get('/authors/id/:id', 'AuthorController.show')


Route.get('/albums', 'AlbumController.index')
Route.post('/albums', 'AlbumController.store')
Route.get('/albums/id/:id', 'AlbumController.show')

Route.get('/tracks', 'TrackController.index')
Route.post('/tracks', 'TrackController.store')
