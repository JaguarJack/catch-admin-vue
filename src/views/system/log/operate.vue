<template>
    <a-card :bordered="false">
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
                showPagination="auto"
        >
            <span slot="created_at" slot-scope="text, record">
                {{ toDate(record.created_at) }}
            </span>
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
  import { operateLogList, emptyOperateLog } from '@/api/log'
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
            dataIndex: 'route',
          },
          {
            title: '请求方式',
            dataIndex: 'method'
          },
          {
            title: '参数',
            dataIndex: 'params',
            scopedSlots: { customRender: 'params' },
          },
          {
            title: '操作时间',
            dataIndex: 'created_at',
            scopedSlots: { customRender: 'created_at' },
            sorter: true
          },
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return operateLogList(Object.assign(parameter, this.queryParam))
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
            emptyOperateLog().then((res) => {
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
