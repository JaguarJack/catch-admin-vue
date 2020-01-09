<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-input allowClear v-model="queryParam.department_name" placeholder="请输入菜单名名称"/>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-select allowClear v-model="queryParam.status" placeholder="请选择状态" default-value="0">
              <a-select-option value="1">启用</a-select-option>
              <a-select-option value="2">禁用</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.departmentModal.add()">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :bordered="true"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item><a @click="handleAddSon(record)">新增</a></a-menu-item>
              <a-menu-item><a @click="handleDel(record)">删除</a></a-menu-item>
            </a-menu>
            <a>更多<a-icon type="down"/></a>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <create-department ref="departmentModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateDepartment from './form/create'
import { getDepartmentList, del } from '@/api/departments'

export default {
  name: 'Departments',
  components: {
    STable,
    CreateDepartment
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '部门名称',
          dataIndex: 'department_name'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: this.renderStatus
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDepartmentList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      }
    }
  },
  methods: {
    handleEdit (record) {
      this.$refs.departmentModal.edit(record)
    },
    handleAddSon (record) {
      this.$refs.departmentModal.addSon(record)
    },
    handleDel (record) {
      this.$confirm({
        title: '确定删除' + record.department_name + '吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(record.id).then((res) => {
            this.$notification['success']({
              message: res.message,
              duration: 4
            })
            this.handleOk()
          }).catch(err => this.failed(err))
        },
        onCancel () {}
      })
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    failed (errors) {
      this.$notification['error']({
        message: errors.message,
        duration: 4
      })
      this.handleCancel()
    },
    resetSearchForm () {
      this.queryParam = {}
      this.handleOk()
    },
    renderStatus (value, row, index) {
      return value === 1 ? <a-button type="normal" size="small">启用</a-button> : <a-button type="danger" size="small">禁用</a-button>
    }
  }
}
</script>
