/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/tracks/file/:file', 'TrackController.file')
Route.get('/playlists/file/image/:file', 'PlaylistController.fileImage')