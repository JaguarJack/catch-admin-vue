export default {
  methods: {
    exportExcelTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        let header = []
        this.getImportFields().forEach(function(field){
          header.push(field.name)
        })
        const data = []
        excel.export_json_to_excel({
          header: header, //表头 必填
          data, //具体数据 必填
          filename: 'template', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
      })
    },

    getImportFields() {
      const extraExcelFields = this.getParent.table.excel === undefined ? [] : this.getParent.table.excel
      let importFields = []
      const defaultOptions = [{ value: 1, label: '是'}, { value: 2, label : '否'}]
      const headers = this.filterExcelFields()
      headers.forEach(function(header){
        if (header.export === undefined) {
          if (header.component !== undefined) {
            const name = header.component[0].name
            if (name === 'switch_' || name === 'select_') {
              importFields.push({
                name: header.label,
                field: header.prop,
                options: header.component[0].options.length > 0 ? header.component[0].options : defaultOptions
              })
            } else {
              importFields.push({
                name: header.label,
                field: header.prop
              })
            }
          } else {
            importFields.push({
              name: header.label,
              field: header.prop
            })
          }
        }
      })

      extraExcelFields.forEach(function(item){
        if (item.import !== undefined) {
          if (item.import === true) {
            importFields.push({
              name: item.label,
              field: item.prop,
              options: item.options === undefined ? [] : item.options
            })
          }
        } else {
          importFields.push({
            name: item.label,
            field: item.prop,
            options: item.options === undefined ? [] : item.options
          })
        }
      })

      return importFields
    },

    getExportFields() {
      const headers = this.filterExcelFields()
      const extraExcelFields = this.getParent.table.excel === undefined ? [] : this.getParent.table.excel

      let exportFields = []
      const defaultOptions = [{ value: 1, label: '是'}, { value: 2, label : '否'}]
      // export fields
      headers.forEach(function(header){
        if (header.export === undefined) {
          if (header.component !== undefined) {
            const name = header.component[0].name
            if (name === 'switch_' || name === 'select_') {
              exportFields.push({
                name: header.label,
                field: header.prop,
                options: header.component[0].options.length > 0 ? header.component[0].options : defaultOptions
              })
            }
          } else {
            exportFields.push({
              name: header.label,
              field: header.prop
            })
          }
        }
      })

      extraExcelFields.forEach(function(item){
        if (item.export !== undefined) {
          if (item.export === true) {
            exportFields.push({
              name: item.label,
              field: item.prop,
              options: item.options === undefined ? [] : item.options
            })
          }
        } else {
          exportFields.push({
            name: item.label,
            field: item.prop,
            options: item.options === undefined ? [] : item.options
          })
        }
      })

      return exportFields
    },

    filterExcelFields() {
      let headers = this.getParent.table.headers

      return headers.filter(function(header) {
        return header.prop !== undefined && header.prop
      })
    },
  }
}
