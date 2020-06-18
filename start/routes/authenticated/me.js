const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/me', 'MeController.show')
  Route.put('/me', 'MeController.update')
  Route.put('/me/password', 'MeController.updatePassword')
  Route.get('/me/home-page', 'MeController.homePage')
  
  
  Route.get('/me/playlists', 'MeController.showFollowersPlaylists')
  Route.get('/me/authors', 'MeController.showFollowersAuthors')
  Route.get('/me/albums', 'MeController.showFollowersAlbums')
  Route.get('/me/favorites', 'MeController.showFollowersTracks')
  Route.get('/me/favorites-player', 'MeController.showFollowersTracksPlayer')
  Route.get('/me/favorites/:id/:type', 'MeController.showFollow')
  Route.post('/me/favorites/:id/:type', 'MeController.createFollow')
  Route.delete('/me/favorites/:id/:type', 'MeController.deleteFollow')


  Route.post('/me/action-tracer', 'MeController.actionTracer')

})
.middleware('auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))