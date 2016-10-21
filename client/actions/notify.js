module.exports = {
  log (content) {
    this.$state.notifyMessages.push({ content })
  },

  primary (content) {
    this.$state.notifyMessages.push({ type: 'primary', content })
  },

  info (content) {
    this.$state.notifyMessages.push({ type: 'info', content })
  },

  success (content) {
    this.$state.notifyMessages.push({ type: 'success', content })
  },

  warning (content) {
    this.$state.notifyMessages.push({ type: 'warning', content })
  },

  danger (content) {
    this.$state.notifyMessages.push({ type: 'danger', content })
  },

  error (err) {
    let content = 'Error'

    if (err && err.message) {
      content = err.message
    }

    if (err && err.response && err.response.body && err.response.body.message) {
      content = err.response.body.message
    }

    if (typeof err === 'string') {
      content = err
    }

    this.$state.notifyMessages.push({ type: 'danger', content })
  },

  remove (message) {
    let index = this.$state.notifyMessages.indexOf(message)
    this.$state.notifyMessages.splice(index, 1)
  }
}
