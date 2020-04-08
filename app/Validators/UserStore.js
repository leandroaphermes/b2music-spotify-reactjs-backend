'use strict' 

const { rule } = use('Validator')

class User {
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
  get messages () {
    return {
      integer: "{{ field }} is value type Integer",
      string: "{{ field }} is value type String",
      required: "{{ field }} is required to create new account",
      email: "{{ field }} is not a valid email",
      alpha: "{{ field }} can only contain letters",
      alpha_numeric: "{{ field }} can only contain letters and number",
      same: "{{ field }} value must be equal to {{ argument.0 }}",
      dateFormat: "{{ field }} date format required {{ argument.0 }}",
      min: "{{ field }} value must be greater than or equal to {{ argument.0 }}",
      max: "{{ field }} value must be less than or equal to {{ args.0 }}",
      in: " {{ field }} value must be {{ argument.0 }} or {{ argument.1 }}"
    }
  }
  get sanitizationRules () {
    return {
      email: [
        rule("normalize_email", {
          all_lowercase: true,
          icloud_remove_subaddress: true
        }),
        rule("trim")
      ]
    }
  }
}

module.exports = User
