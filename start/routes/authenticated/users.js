const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/users', 'UserController.index')
  Route.get('/users/:username', 'UserController.show')
  /* Route.put('/users/:id', 'UserController.update') */

})
.middleware('auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))