export default {
  data() {
    return {
      renderTypeList: {
        render: {},
        action: {
          target: 'elements-mapping'
        },
        component: {
          target: 'components-mapping'
        }
      },
      updateKey: 0,
      showDialog: false,
      source: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sizes: [10, 20, 30, 50]
      },
      // 多选
      selectedIds: [],
      // form data 数据, 为了渲染 Dialog 打开后渲染
      form: {
        // form data
        data: null,
        // form create fill data
        isCreatedFillData: false,
        // form create options
        options: {
          global: {
            upload: {
              props: {
                onSuccess: function(res, file) {
                  file.url = res.data
                }
              }
            }
          },
          submitBtn: {
            icon: 'el-icon-s-promotion',
            innerText: '确定',
            click: this.handleFormSubmit,
            col: {
              span: 12,
              offset: 2
            }
          },
          resetBtn: {
            innerText: '取消',
            show: true,
            icon: 'el-icon-switch-button',
            click: this.handleCancel,
            col: {
              span: 12,
              offset: 12
            }
          }
        }
      }
    }
  }
}
