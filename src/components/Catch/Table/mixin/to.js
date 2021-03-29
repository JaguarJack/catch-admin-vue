export default {
  methods: {
    to(row, route) {
      this.$router.push(route + '/' + row.id)
    }
  }
}
