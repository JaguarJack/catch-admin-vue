<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="4" :sm="24">
                        <a-input allowClear v-model="queryParam.word" placeholder="请输入敏感词"/>
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
            <a-button type="primary" icon="plus" @click="$refs.wordModal.add()">新建</a-button>
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
          <a @click="$refs.wordModal.edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </template>
      </span>
        </s-table>
        <create-word ref="wordModal" @ok="handleOk" @refreshList="handleOk"/>
    </a-card>
</template>

<script>
  import { STable } from '@/components'
  import CreateWord from './form'

  export default {
    name: 'sensitiveWord',
    components: {
      STable,
      CreateWord
    },
    data () {
      return {
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '敏感词',
            dataIndex: 'word'
          },
          {
            title: '创建人',
            dataIndex: 'creator'
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
          return this.$http.get('sensitive/word',Object.assign(parameter, this.queryParam))
            .then(res => {
              return res
            })
        }
      }
    },
    methods: {
      handleDel (record) {
        this.$confirm({
          title: '确定删除' + record.word + '吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.$http.delete('sensitive/word',record.id).then((res) => {
              this.toast(res)
              this.handleOk()
            })
          },
          onCancel () {}
        })
      },
      handleOk () {
        this.$refs.table.refresh(true)
      },
      resetSearchForm () {
        this.queryParam = {}
        this.handleOk()
      }
    }
  }
</script>
