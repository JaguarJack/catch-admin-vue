import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  data() {
    return {
      importVisible: false,
      importAction: '',
      importHeaders: {},
      importList: [],
      extraImport: {},
      importLoading: false
    }
  },
  methods: {
    handleSubmitImport() {
      this.importLoading = true
      this.$refs.importUpload.submit()
    },
    handleImport() {
      this.importHeaders.authorization = 'Bearer ' + this.token

      this.importVisible = true

      this.extraImport.fields = JSON.stringify(this.getImportFields())
      this.extraImport.model = this.getParent.table.usedModel

      if (this.getParent.beforeImport !== undefined) {
        this.getParent.beforeImport()
      }

      // 切换 action
      if (this.getParent.table.usedModel !== undefined) {
        this.importAction = process.env.VUE_APP_BASE_API + '/excel/import'
      } else {
        this.importAction = process.env.VUE_APP_BASE_API + this.getParent.table.importRoute;
      }
    },
    importSuccess(response, file, fileList) {
      this.importLoading = false
      if (response.data.code === 10000) {
        this.importVisible = false
        this.importList = []
        this.$emit('ok')
        this.$message.success('导入成功')
      } else {
        this.$message.error(response.data.message)
      }
    }
  }
}
