/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/tracks', 'TrackController.index')
  Route.post('/tracks', 'TrackController.store')
  Route.get('/tracks/:id', 'TrackController.show')

}).middleware('auth').formats(['json'])