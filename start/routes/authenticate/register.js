const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  Route.post('/register', 'UserController.store')
})
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))