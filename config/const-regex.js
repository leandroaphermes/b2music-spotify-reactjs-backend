const ALFA = /[a-z]/
const ALFA_CS = /[a-z]/i

const NUMBER = /[0-9]/

const ALFA_NUMBER = /[a-z0-9]/
const ALFA_NUMBER_CS = /[a-z0-9]/i

const ALFA_NUMBER_SPACE = /^[0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/
const ALFA_NUMBER_SPACE_CS = /^[0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/i

const ESPECIAL_CHARACTER_ACCEPT = /[!@#$%&\-_.]/


/* regex specific */
const PASSWORD_VALIDATION = /^(?=.*[!@#$%&\-_.])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%&\-_.]+$/
const EMAIL_VALIDATION = /^((?!.*__+)(?!.*\.\.+)[a-zA-Z]{1}[a-zA-Z0-9._]{2,})@[a-zA-Z0-9._]{2,}\.[a-zA-Z]{2,}$/
const USERNAME_VALIDATION = /^[a-z]{1}[a-z0-9]+$/
const HEX_COLOR_VALIDATION_CS = /^[a-f0-9]{6}$|^[a-f0-9]{3}$/i

/* Dates */
const DATE_VALIDATION = /^(\d{4})-((0[1-9])|(1[0-2]))-((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))$/

const PHONE_VALIDATION = {
  br: /^\([1-9]{2}\) \d{5}-\d{4}$/
}

/* Masks */
const MASK_PHONE = {
  br: /^([1-9]{2})(\d{5})(\d{4})/
}

module.exports = {
  ALFA,
  ALFA_CS,
  NUMBER,
  ALFA_NUMBER,
  ALFA_NUMBER_CS,
  ALFA_NUMBER_SPACE,
  ALFA_NUMBER_SPACE_CS,
  ESPECIAL_CHARACTER_ACCEPT,
  PASSWORD_VALIDATION,
  EMAIL_VALIDATION,
  USERNAME_VALIDATION,
  DATE_VALIDATION,
  PHONE_VALIDATION,
  HEX_COLOR_VALIDATION_CS,
  MASK_PHONE
}