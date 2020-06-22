const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/genres', 'GenreController.index')
  Route.post('/genres', 'GenreController.store')
  Route.get('/genres/:genre_url', 'GenreController.show')

})
.middleware('auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))