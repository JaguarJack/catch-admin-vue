export default {
  data() {
    return {
      table: {
        ref: 'catchTable',
        headers: [
          {
            label: '部门名称',
            prop: 'department_name',
          },
          {
            label: '排序',
            prop: 'sort',
            sortable: true
          },
          {
            label: '状态',
            prop: 'status',
            renderComponent(row) {
              return [
                { name: 'status', data: row }
              ]
            },
          },
          {
            label: '创建时间',
            prop: 'created_at',
          },
          {
            label: '操作'
          }
        ],
        search: [
          { type: 'input', name: 'department_name', placeholder: '请输入部门名称'},
          { type: 'select', name: 'status', placeholder: '请选择状态', options: [
              {text: '启用', value: 1}, { text: '禁用', value: 2}
          ]}
        ],
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
            field: 'department_name',
            title: '部门名称',
            validate: [
              {type: 'string', required: true, message:'请输入部门名称'}
            ]
          },
          {
            type: 'input',
            field: 'principal',
            title: '部门负责人'
          },
          {
            type: 'input',
            field: 'mobile',
            title: '部门名称'
          },
          {
            type: 'input',
            field: 'email',
            title: '邮箱'
          },
          {
            type: 'radio',
            title: '状态',
            field: 'status',
            value: 1,
            options:[
              { value: 1,label: '启用'},
              { value: 2,label: '禁用'},
            ],
          },
          {
            type: 'InputNumber',
            field: 'sort',
            title: '排序',
            value: 1,
            max: 100000,
            min: 1,
          },
          {
            type: 'hidden',
            field: 'id',
          },
          {
            type: 'hidden',
            field: 'parent_id',
          }
        ],
      }
    }
  },
  methods: {
    beforeCreate(row) {
      this.$refs.catchTable.dialog.title = '新增(' + row.department_name + ')'
      this.$refs.catchTable.form.data = {parent_id: row.id}
      this.$refs.catchTable.form.isCreatedFillData = true
    }
  }
}
