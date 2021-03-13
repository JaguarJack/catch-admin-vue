export default {
  data() {
    return {
      table: {
        ref: 'catchTable',
        headers: [
          {
            type: 'selection',
            width: 50,
          },
          {
            label: '编号',
            prop: 'id',
            width: 80,
          },
          {
            label: '敏感词',
            prop: 'word'
          },
          {
            label: '创建人',
            prop: 'creator'
          },
          {
            label: '创建时间',
            prop: 'created_at'
          },
          {
            label: '更新时间',
            prop: 'created_at'
          },
          {
            label: '操作',
            width: '260'
          }
        ],
        // 搜索配置
        search: [
          { type: 'input', name: 'word', placeholder: '请输入敏感词' },
        ],
        // 搜索双向绑定
        filterParams: { status: '', department_name: ''},
        // 表单事件
        events: {
          'selection-change': this.handleSelectMulti
        },
        // 表单新增
        actions: [
          { icon: 'el-icon-plus', text: '新增', class: 'filter-item fr', action: () => {
              this.$refs.catchTable.handleShowDialog()
            }}
        ]
      },
      formCreate: {
        fApi: null,
        rule: [
          {
            type: 'input',
            field: 'word',
            title: '敏感词',
            validate: [
              {type: 'string', required: true, message:'请输入敏感词'}
            ]
          },
          {
            type: 'hidden',
            field: 'id',
          }
        ],
      }
    }
  },
  methods: {
    beforeDelete() {
      alert(123)
    },
    handleSelectMulti(rows) {
      this.$refs.catchTable.handleSelectMulti(rows)
    }
  }
}
