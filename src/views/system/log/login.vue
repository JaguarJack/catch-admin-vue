<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="[16,{ md:0,sm: 16}]">
          <a-col :md="6" :sm="24">
            <a-form-item label="登录用户">
              <a-input allowClear v-model="queryParam.login_name" placeholder="请输入登录用户" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="登录IP">
              <a-input allowClear v-model="queryParam.login_ip" placeholder="请输入登录IP" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-range-picker @change="onChange"/>
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
      <a-button type="primary" icon="delete" @click="clear()">清空</a-button>
      <a-button icon="sync" @click="handleOk()">刷新</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :bordered="true"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectTables }"
      showPagination="auto"
    >
      <span slot="login_at" slot-scope="text, record">
        {{ toDate(record.login_at) }}
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { loginLogList, emptyLoginLog } from '@/api/log'
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
          title: '登陆用户',
          dataIndex: 'login_name'
        },
        {
          title: '登陆IP',
          dataIndex: 'login_ip'
        },
        {
          title: '客户端',
          dataIndex: 'browser'
        },
        {
          title: '系统',
          dataIndex: 'os'
        },
        {
          title: '登陆时间',
          dataIndex: 'login_at',
          scopedSlots: { customRender: 'login_at' },
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return loginLogList(Object.assign(parameter, this.queryParam))
          .then(res => {
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
          emptyLoginLog().then((res) => {
            this.toast(res)
            this.handleOk()
          }).catch(err => this.failed(err))
        }
      })
    },
    toDate (timestamp) {
      return timestampToDate(timestamp * 1000)
    },
    resetSearchForm () {
      this.queryParam = {}
      this.handleOk()
    },
    onChange (date, dateString) {
      dateString[0] = dateString[0] + ' 00:00:00'
      dateString[1] = dateString[1] + ' 23:59:00'
      this.queryParam.login_at = dateString
    }
  }
}
</script>
