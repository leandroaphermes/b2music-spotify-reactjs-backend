'use strict'
const Env = use('Env')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get dates() {
    return super.dates.concat(['birth'])
  }
  
  static castDates(field, value) {
    if (field === 'birth') {
      return value.format('YYYY-MM-DD')
    }
    return super.formatDates(field, value)
  }
  
  playlists (){
    return this.hasMany('App/Models/Playlist')
  }

  getPhotoUrl(photo_url){
    return photo_url !== "" ? `${Env.get('NODE_ENV') === 'development' ? Env.get('APP_URL') : Env.get('APP_URL_PUBLIC')}/${Env.get('PREFIX_ROUTER')}/users/photo/${photo_url}` : ""
  }
  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

}

module.exports = User
