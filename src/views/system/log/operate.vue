<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="操作人">
              <a-input allowClear v-model="queryParam.creator" placeholder="请输入操作人" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="操作模块">
              <a-input allowClear v-model="queryParam.module" placeholder="请输入操作模块名称" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="请求方式">
              <a-select v-model="queryParam.method" placeholder="请选择" default-value="GET">
                <a-select-option value="GET">GET</a-select-option>
                <a-select-option value="POST">POST</a-select-option>
                <a-select-option value="PUT">PUT</a-select-option>
                <a-select-option value="DELETE">DELETE</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-range-picker @change="onChange"/>
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
      <a-button type="primary" icon="delete" @click="clear()">清空</a-button>
      <a-button icon="sync" @click="handleOk()">刷新</a-button>
      <a-dropdown v-if="selectedRows.length">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="remove">
            <a-icon type="delete" />批量删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
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
      showPagination="auto"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="created_at" slot-scope="text, record">{{ toDate(record.created_at) }}</span>
      <span slot="params" slot-scope="text, record">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ record.params }}</span>
          </template>
          <a-button size="small" type="primary">查看</a-button>
        </a-tooltip>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { operateLogList, emptyOperateLog, deleteOperateLog } from '@/api/log'
import { timestampToDate } from '@/utils/date'

export default {
  name: 'Database',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '操作人',
          dataIndex: 'creator'
        },
        {
          title: '操作模块',
          dataIndex: 'module'
        },
        {
          title: '操作菜单',
          dataIndex: 'operate'
        },
        {
          title: '路由',
          dataIndex: 'route'
        },
        {
          title: '请求方式',
          dataIndex: 'method'
        },
        {
          title: '参数',
          dataIndex: 'params',
          scopedSlots: { customRender: 'params' }
        },
        {
          title: '操作时间',
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
          sorter: true
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return operateLogList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectTables: []
    }
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh(true)
    },
    clear () {
      this.$confirm({
        title: '确定清空全部日志吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          emptyOperateLog()
            .then(res => {
              this.toast(res)
              this.handleOk()
            })
            .catch(err => this.failed(err))
        }
      })
    },
    toDate (timestamp) {
      return timestampToDate(timestamp * 1000)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleDeleteSelected () {
      this.handleDelete(false, this.selectedRowKeys)
    },
    handleDelete (isRow = false, value = '') {
      const ids = isRow ? value.id : this.selectedRowKeys.join()
      this.$confirm({
        title: isRow ? '确定删除此项吗' : '确定删除已选中项吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          const hide = this.$message.loading('删除中..', 0)
          console.log({ id: ids })
          deleteOperateLog({ id: ids })
            .then(res => {
              this.$message.success('删除成功')
              this.handleOk()
            })
            .finally(() => {
              hide()
              this.loading = false
            })
        }
      })
    },
    handleMenuClick ({ key }) {
      switch (key) {
        case 'remove': {
          this.handleDeleteSelected()
        }
      }
    },
    resetSearchForm () {
      this.queryParam = {}
      this.handleOk()
    },
    onChange (date, dateString) {
      dateString[0] = dateString[0] + ' 00:00:00'
      dateString[1] = dateString[1] + ' 23:59:00'
      this.queryParam.create_at = dateString
    }
  }
}
</script>
