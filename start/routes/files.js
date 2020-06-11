const Env = use('Env')
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( ()=> {
  Route.get('/tracks/file/:file', 'TrackController.file')
  Route.get('/playlists/file/image/:file', 'PlaylistController.fileImage')
})
.formats(['json'])
.prefix(Env.get('PREFIX_ROUTER'))