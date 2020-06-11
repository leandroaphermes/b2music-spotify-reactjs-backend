const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  
  Route.get('/playlists', 'PlaylistController.index')
  Route.post('/playlists', 'PlaylistController.store')
  Route.get('/playlists/:id', 'PlaylistController.show')
  Route.put('/playlists/:id', 'PlaylistController.update')
  Route.delete('/playlists/:id', 'PlaylistController.destroy')
  Route.post('/playlists/:id/track/:track_id', 'PlaylistController.storeTrack')
  Route.delete('/playlists/:id/track/:track_id', 'PlaylistController.destroyTrack')
  

})
.middleware('auth')
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))