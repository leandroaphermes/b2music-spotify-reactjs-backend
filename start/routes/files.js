const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  Route.get('/tracks/file/:file', 'TrackController.file')
  Route.get('/playlists/file/image/:file', 'PlaylistController.fileImage')
  Route.get('/users/photo/:file', 'UserController.fileImage')
})
.prefix(Env.get('PREFIX_ROUTER'))