<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="delete" @click="clear()">清空</a-button>
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
          dataIndex: 'os',
          sorter: true
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
    clear() {
      this.$confirm({
        title: '确定清空全部日志吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          emptyLoginLog().then((res) => {
            this.$notification['success']({
              message: res.message,
              duration: 4
            })
            this.handleOk()
          }).catch(err => this.failed(err))
        }
      })
    },
    toDate (timestamp) {
        return timestampToDate(timestamp * 1000)
    }
  }
}
</script>
