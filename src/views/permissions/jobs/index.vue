<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="6" :sm="24">
            <a-form-item label="岗位名称">
              <a-input allowClear v-model="queryParam.job_name" placeholder="请输入岗位名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="岗位编码">
              <a-input allowClear v-model="queryParam.coding" placeholder="请输入编码"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select allowClear v-model="queryParam.status" placeholder="请选择状态" default-value="0">
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.jobModal.add()">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item @click="handleMultiDel()"><a-icon type="delete"/>批量删除</a-menu-item>
        </a-menu>
        <a-button>
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :alert="true"
      :bordered="true"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)" class="ant-btn ant-btn-sm ant-btn-primary">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)" class="ant-btn ant-btn-sm ant-btn-danger">删除</a>
        </template>
      </span>
    </s-table>
    <create-job ref="jobModal" @ok="refreshTable" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateJob from './form/create'
import { del, getJobList } from '@/api/jobs'

export default {
  name: 'Jobs',
  components: {
    STable,
    CreateJob
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: '60px',
          align: 'center'
        },
        {
          title: '岗位名称',
          dataIndex: 'job_name'
        },
        {
          title: '编码',
          dataIndex: 'coding'
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
          title: '更新时间',
          dataIndex: 'updated_at',
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
        return getJobList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      selectedRowKeys: []
    }
  },
  created () {
    // this.tableOption()
  },
  methods: {
    renderStatus (value, row, index) {
      return value === 1 ? <a-button type="primary" size="small">正常</a-button> : <a-button type="danger" size="small">禁用</a-button>
    },
    handleEdit (record) {
      this.$refs.jobModal.edit(record)
    },
    handleDel (record) {
      this.$confirm({
        title: '确定删除' + record.job_name + '吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(record.id).then((res) => {
            this.toast(res)
            this.refreshTable()
          })
        },
        onCancel () {}
      })
    },
    refreshTable () {
      // 清空多选
      this.$refs.table.clearSelected()
      // refresh(true) 刷新到第一页
      this.$refs.table.refresh(true)
    },
    handleMultiDel () {
      this.$confirm({
        title: '确定批量删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(this.selectedRowKeys.join(',')).then((res) => {
            this.toast(res)
            this.refreshTable()
          })
        },
        onCancel () {}
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    resetSearchForm () {
      this.queryParam = {}
      this.refreshTable()
    }
  }
}
</script>
