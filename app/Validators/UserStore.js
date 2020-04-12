'use strict' 

const { rule } = use('Validator')

const Antl = use('Antl')

class UserStore {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      username: "required|alpha_numeric|min:4|max:32|unique:users",
      email: "required|email|min:6|max:64|unique:users",
      password: "required|confirmed|string|min:4|max:32",
      password_confirmation: "required|same:password",
      truename: "required|string|min:4|max:100",
      phone: "required|string|min:14|max:20",
      gender: "required|string|alpha|in:F,M",
      birth: [
        rule("required"),
        rule("date"),
        rule("dateFormat", "YYYY-MM-DD")
      ],
      country: "required|string|alpha|min:4|max:20",
      province: "required|string|alpha|min:2|max:5"
    }
  }
  get sanitizationRules () {
    return {
      username: [ rule("trim") ],
      email: [
        rule("normalize_email", {
          all_lowercase: true,
          icloud_remove_subaddress: true
        }),
        rule("trim")
      ],
      password: [ rule("trim") ],
      truename: [ rule("trim") ],
      phone: [ rule("trim") ],
      gender: [ rule("trim") ],
      country: [ rule("trim") ],
      province: [ rule("trim") ]
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserStore
