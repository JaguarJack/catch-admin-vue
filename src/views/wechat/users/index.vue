<template>
    <a-card :bordered="false">
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
         {{ toDate(record.subscribe_time) }}
      </span>
        </s-table>
    </a-card>
</template>

<script>
  import { STable } from '@/components'
  import { loginLogList, emptyLoginLog } from '@/api/log'
  import { timestampToDate } from '@/utils/date'

  export default {
    name: 'index',
    components: {
      STable
    },
    data () {
      return {
        // 查询参数
        nextOpenid: null,
        // 表头
        columns: [
          {
            title: '昵称',
            dataIndex: 'nickname'
          },
          {
            title: '性别',
            dataIndex: 'sex'
          },
          {
            title: '备注',
            dataIndex: 'remark'
          },
          {
            title: '系统',
            dataIndex: 'os',
            sorter: true
          },
          {
            title: '订阅时间',
            dataIndex: 'subscribe_time',
            scopedSlots: { customRender: 'subscribe_time' },
            sorter: true
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('wechat/official/users' + (this.nextOpenid ? '/' + this.nextOpenid : '')).then(res => {
                this.nextOpenid = res.data.next_openid
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
      toDate (timestamp) {
        return timestampToDate(timestamp * 1000)
      }
    }
  }
</script>
