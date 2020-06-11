const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.post('/auth', 'UserController.auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))