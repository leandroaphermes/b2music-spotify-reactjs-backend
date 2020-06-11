const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/authors', 'AuthorController.index')
  Route.post('/authors', 'AuthorController.store')
  Route.get('/authors/:id', 'AuthorController.show')

})
.middleware('auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))