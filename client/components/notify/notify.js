export default {
  props: {
    messages: Array
  },

  data () {
    return {

    }
  },

  mounted () {

  },

  methods: {
    onCloseClick (message) {
      this.$emit('remove', message)
    }
  }
}
