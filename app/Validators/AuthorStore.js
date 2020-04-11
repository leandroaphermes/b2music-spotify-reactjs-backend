'use strict' 

const { rule } = use('Validator')
const Antl = use('Antl')

class AuthorStore {
  get validateAll () {
    return true
  }
  get rules () {
    return {
    }
  }
  get sanitizationRules () {
    return {
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = AuthorStore
