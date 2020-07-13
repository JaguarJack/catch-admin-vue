<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-input allowClear v-model="queryParam.username" placeholder="请输入开发者名称"/>
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

    <s-table
        ref="table"
        size="default"
        rowKey="id"
        :bordered="true"
        :columns="columns"
        :data="loadData"
        :showPagination="false"
    >
    </s-table>
  </a-card>
</template>

<script>
  import { STable } from '@/components'

  export default {
    name: 'Developers',
    components: {
      STable,
    },
    data () {
      return {
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '用户名',
            dataIndex: 'role_name'
          },
          {
            title: '手机号',
            dataIndex: 'description'
          },
          {
            title: '状态',
            dataIndex: 'status'
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            sorter: true
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('developer',Object.assign(parameter, this.queryParam))
                  .then(res => {
                    return res
                  })
        }
      }
    },
    methods: {
      handleEdit (record) {
        this.$refs.roleModal.edit(record)
      },
      handleDel (record) {
        this.$confirm({
          title: '确定删除' + record.username + '吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.$http.del('developer/' + record.id).then((res) => {
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
