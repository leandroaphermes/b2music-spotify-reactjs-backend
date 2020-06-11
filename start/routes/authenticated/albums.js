const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/albums', 'AlbumController.index')
  Route.post('/albums', 'AlbumController.store')
  Route.get('/albums/:id', 'AlbumController.show')

})
.middleware('auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))