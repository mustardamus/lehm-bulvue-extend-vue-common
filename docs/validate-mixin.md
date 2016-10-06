# Validate Mixin

In order to have simple but effective (form) validation in your components, you
can use the `validate` mixin located in `../mixins/validate.js`. It does support
[validator.js](https://github.com/chriso/validator.js)'s many validation
functions out of the box and you can write your own validators.

## Example Usage

    export default {
      template: `
        <form @submit.prevent="onSubmit">
          <div class="control">
            <input type="text" placeholder="Username"
              :class="{ input: true, 'is-danger': errors.username }"
              v-model="fields.username"
            >
            <span class="help is-danger" v-for="message in errors.username">
              Username {{message}}
            </span>
          </div>

          <div class="control">
            <input type="text" placeholder="E-Mail"
              :class="{ input: true, 'is-danger': errors.email }"
              v-model="fields.email"
            >
            <span class="help is-danger" v-for="message in errors.email">
              E-Mail {{message}}
            </span>
          </div>

          <div class="control">
            <input type="password" placeholder="Password"
              :class="{ input: true, 'is-danger': errors.password }"
              v-model="fields.password"
            >
            <span class="help is-danger" v-for="message in errors.password">
              Password {{message}}
            </span>
          </div>

          <div class="control">
            <input type="password" placeholder="Password Confirmation"
              :class="{ input: true, 'is-danger': errors.passwordConfirmation }"
              v-model="fields.passwordConfirmation"
            >
            <span class="help is-danger" v-for="message in errors.passwordConfirmation">
              Password confirmation {{message}}
            </span>
          </div>

          <div class="control">
            <button class="button is-primary" type="submit">Register</button>
          </div>
        </form>
      `,
      mixins: [require('../../mixins/validate')],           // require the mixin for the component

      data () {
        return {
          fields: {                                         // fields on your form, linked via v-model
            username: '',                                   // initial value or empty string
            email: '',                                      // note that they must be strings if you use
            password: '',                                   // validator.js functions
            passwordConfirmation: ''                        // use custom validatiors for other types
          },

          rules: {                                          // rules to apply to fields with the same key
            username: '!isEmpty,isAlphanumeric',            // rules are function names of validator.js, comma separated
            email: '!isEmpty,isEmail',                      // invert the result with prepending a !
            password: '!isEmpty,isPasswordLength',          // if the function name does not exist in validator.js
            passwordConfirmation: 'isPasswordConfirmation'  // the mixin is looking for a function in the component
          },                                                // which must return true (valid) or false (invalid)

          messages: {                                       // the message to put in the this.errors object (default see below) 
            isPasswordLength: 'must be > 6 characters long',// messages are for the function names, not the field
            isPasswordConfirmation: 'must match password'   // they are optional, but look way nicer
          },

          errors: {                                         // will be filled by the mixin when calling this.$validate()
          }                                                 // see object example below
        }
      },

      methods: {
        onSubmit () {
          if (this.$validate()) {                           // the this.$validate function returns either
            this.$emit('data', {                            // true (all valid) or false (some invalid)
              username: this.fields.username,
              email: this.fields.email,
              password: this.fields.password
            })
          }
        },

        isPasswordLength (val) {                            // a custom validator function, val is the value to validate
          return this.$validator.isByteLength(val, { min: 6 }) // access a instance of validator.js with this.$validator
        },                                                  // must return either true (valid) or false (invalid)

        isPasswordConfirmation (val) {                      // another custom validator function
          return this.$validator.equals(val, this.fields.password)
        }
      }
    }

## How the `this.errors` object is built

Once you call `this.$validate()`, the mixin will do the following:

1. Iterate over every field defined as key in `this.fields` and receive it's
   value. Note that `this.$validator.trim()` is applied if the value is a
   string.
2. Iterate over every rule (comma separated) defined for the field key and try
   to find the function in `validator.js`. If the function is not found, try to
   find it in the component instance. If it's not found there, the mixin will
   throw an error and stop validation.
3. Call the function and receive the result. If the function name is leading
   with a `!`, the result is inversed. If the result is `true`, that means the
   value is valid, otherwise its `false` and invalid.
4. If the result is `false`, the mixin try to find a error message in
   `this.messages`. If no error message is found, it will create a dynamic one.
5. If the result is `false`, the error message will be pushed to an array
   under the `this.errors` object with the key of the field.
6. If the result is `false`, the overall validation is considered invalid and
   `this.$validate` will return `false` when all fields are processed.

## Example of `this.errors` object

    errors: {
      username: [
        'is required'
      ],
      email: [
        'is required',
        'must be a valid e-mail'
      ],
      isPasswordConfirmation: [
        'must match password'
      ]
    }

You can either show these error messages in your template one by one as seen in
the example component above, or check if the key exist for the field, eg.
`this.errors.username`, and show a overall error message for that field in the
template.

## Default error messages

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

You can overwrite these messages by using the same key, eg:

    messages: {
      isEmpty: 'is absolutely required'
    }
