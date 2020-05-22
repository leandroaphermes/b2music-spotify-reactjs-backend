/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( () => {

  Route.get('/countrys', 'Utils/Global/CountryController.index')
  Route.get('/countrys/:country_code', 'Utils/Global/CountryController.show')

}).prefix('/utils/global').formats(['json'])