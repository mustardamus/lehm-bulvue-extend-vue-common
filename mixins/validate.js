module.exports = {
  data () {
    return {
      fields: {},
      rules: {},
      errors: {},
      messages: {
        isAlpha: 'can only contain letters',
        isAlphanumeric: 'can only contain letters and numbers',
        isBoolean: 'must be a boolean value',
        isCreditCard: 'must be a valid credit card number',
        isDate: 'must be a valid date',
        isDecimal: 'must be a decimal number',
        isEmail: 'must be a valid e-mail',
        isEmpty: 'is required',
        isFloat: 'must be a floating number',
        isLowercase: 'must be all lowercase',
        isNumeric: 'can only contain numbers',
        isUrl: 'must be a valid URL',
        isUppercase: 'must be all UPPERCASE'
      }
    }
  },

  created () {
    this.$validator = require('validator')
  },

  methods: {
    $validate () {
      let valid = true
      this.errors = {}

      for (let key in this.rules) {
        let val = this.fields[key]
        let funcNames = this.rules[key]

        if (typeof val === 'undefined') {
          console.warn(`There are rules "${funcNames}" for "${key}", but no matching field is defined`)
          continue
        }

        if (typeof val === 'string') {
          val = this.$validator.trim(val)
        }

        for (let funcName of funcNames.split(',')) {
          let inverse = false
          funcName = this.$validator.trim(funcName)

          if (funcName[0] === '!') {
            funcName = funcName.substr(1)
            inverse = true
          }

          let func = this.$validator[funcName]

          if (typeof func === 'undefined') {
            if (typeof this[funcName] === 'undefined') {
              throw new Error(`Can not find validator or custom function "${funcName}" for field "${key}"`)
            }

            func = this[funcName]
          }

          let fieldValid = func(val)

          if (inverse) {
            fieldValid = !fieldValid
          }

          if (!fieldValid) {
            let message = this.messages[funcName] || `${funcName}: invalid`
            valid = false

            if (typeof this.errors[key] === 'undefined') {
              this.errors[key] = [message]
            } else {
              this.errors[key].push(message)
            }
          }
        }
      }

      return valid
    }
  }
}
