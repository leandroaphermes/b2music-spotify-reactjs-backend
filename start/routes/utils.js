const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( () => {

  Route.get('/countrys', 'Utils/Global/CountryController.index')
  Route.get('/countrys/:country_code', 'Utils/Global/CountryController.show')

})
.prefix(`${Env.get('PREFIX_ROUTER')}/utils/global`)
.formats(['json'])