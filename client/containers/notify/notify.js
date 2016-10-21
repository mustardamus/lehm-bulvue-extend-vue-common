import notify from '../../components/notify'

export default {
  components: { notify },

  data () {
    return {
      notifyMessages: [],
      removeTimeout: 8000
    }
  },

  watch: {
    notifyMessages: 'onChange'
  },

  created () {
    this.$mapState('notifyMessages')
  },

  methods: {
    onChange () {
      for (let message of this.notifyMessages) {
        if (!message.timeoutId) {
          message.timeoutId = this.removeMessageAfterTimeout(message)
        }
      }
    },

    removeMessageAfterTimeout (message) {
      return setTimeout(() => {
        this.$actions.notify.remove(message)
      }, this.removeTimeout)
    },

    onRemove (message) {
      this.$actions.notify.remove(message)
    }
  }
}
