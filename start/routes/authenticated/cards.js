/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/cards', 'CardController.index')
  Route.post('/cards', 'CardController.store')
  Route.post('/cards/:id/playlist/:playlist_id', 'CardController.storePlaylist')

}).middleware('auth').formats(['json'])