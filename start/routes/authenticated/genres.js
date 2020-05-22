/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/genres', 'GenreController.index')
  Route.post('/genres', 'GenreController.store')

}).middleware('auth').formats(['json'])