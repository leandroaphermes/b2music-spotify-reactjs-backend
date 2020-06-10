/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/search/:search/track', 'SearchController.showTracks')
  Route.get('/search/:search', 'SearchController.show')

}).middleware('auth').formats(['json'])