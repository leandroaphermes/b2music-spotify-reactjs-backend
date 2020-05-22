/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/me', 'MeController.show')
  Route.put('/me', 'MeController.update')
  Route.put('/me/password', 'MeController.updatePassword')
  Route.get('/me/home-page', 'MeController.homePage')
  
  
  Route.get('/me/playlists', 'MeController.showFollowersPlaylists')
  Route.get('/me/authors', 'MeController.showFollowersAuthors')


  Route.post('/me/action-tracer', 'MeController.actionTracer')

}).middleware('auth').formats(['json'])