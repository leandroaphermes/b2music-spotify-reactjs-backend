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

Route.post('/auth', 'UserController.auth')
Route.post('/register', 'UserController.store')
Route.get('tracks/file/:file', 'TrackController.file')

Route.group( () => {

    
    Route.get('/albums', 'AlbumController.index')
    Route.post('/albums', 'AlbumController.store')
    Route.get('/albums/:id', 'AlbumController.show')


    Route.get('/authors', 'AuthorController.index')
    Route.post('/authors', 'AuthorController.store')
    Route.get('/authors/:id', 'AuthorController.show')


    Route.get('/cards', 'CardController.index')
    Route.post('/cards', 'CardController.store')
    Route.post('/cards/:id/playlist/:playlist_id', 'CardController.storePlaylist')


    Route.get('/genres', 'GenreController.index')
    Route.post('/genres', 'GenreController.store')


    Route.get('/me', 'UserController.showAuth')
    Route.put('/me', 'UserController.updateAuth')
    Route.put('/me/password', 'UserController.updatePasswordAuth')
    Route.get('/me/home-page', 'CardController.homePage')
    Route.get('/me/playlists', 'PlaylistController.playlistsAuth')

    
    Route.get('/playlists', 'PlaylistController.index')
    Route.post('/playlists', 'PlaylistController.store')
    Route.get('/playlists/:id', 'PlaylistController.show')
    Route.post('/playlists/:id/track/:track_id', 'PlaylistController.storeTrack')
    Route.delete('/playlists/:id/track/:track_id', 'PlaylistController.destroyTrack')


    Route.get('/search/:search', 'SearchController.show')


    Route.get('/tracks', 'TrackController.index')
    Route.post('/tracks', 'TrackController.store')
    Route.get('/tracks/:id', 'TrackController.show')

    
    Route.get('/users', 'UserController.index')
    Route.get('/users/:id', 'UserController.show')
    Route.put('/users/:id', 'UserController.update')


}).middleware('auth').formats(['json'])

Route.group( () => {

    Route.get('/countrys', 'Utils/Global/CountryController.index')
    Route.get('/countrys/:country_code', 'Utils/Global/CountryController.show')

}).prefix('/utils/global')





