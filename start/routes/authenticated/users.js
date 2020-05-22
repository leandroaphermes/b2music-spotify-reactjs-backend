/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/users', 'UserController.index')
  Route.get('/users/:id', 'UserController.show')
  Route.put('/users/:id', 'UserController.update')

}).middleware('auth').formats(['json'])