<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" v-if="selectedRowKeys.length > 0">
      <a-button type="primary" icon="safety" @click="multiDel()">删除</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :bordered="true"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <img slot="url" slot-scope="text" :src="text"/>
      <a slot="file_ext" slot-scope="text" @click="searchFileExt(text)" >{{ text }}</a>
      <a slot="mime_type" slot-scope="text" @click="searchMimeType(text)" >{{ text }}</a>
      <a slot="driver" slot-scope="text" @click="searchDriver(text)" >{{ text }}</a>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.tableModal.add(record.name)">查看</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getAttachments, del } from '@/api/attachments'

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
          title: '文件名',
          dataIndex: 'filename'
        },
        {
          title: '预览',
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '路径',
          dataIndex: 'path'
        },
        {
          title: '文件后缀',
          dataIndex: 'file_ext',
          scopedSlots: { customRender: 'file_ext' }
        },
        {
          title: '文件大小',
          dataIndex: 'file_size'
        },
        {
          title: 'MimeType',
          dataIndex: 'mime_type',
          scopedSlots: { customRender: 'mime_type' }
        },
        {
          title: '驱动',
          dataIndex: 'driver',
          scopedSlots: { customRender: 'driver' }
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '70px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getAttachments(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      }
    }
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    resetSearchForm () {
      this.queryParam = {}
      this.handleOk()
    },
    searchFileExt (fileExt) {
      this.queryParam.file_ext = fileExt
      this.$refs.table.refresh(true)
    },
    searchMimeType (mimeType) {
      this.queryParam.mime_type = mimeType
      this.$refs.table.refresh(true)
    },
    searchDriver (driver) {
      this.queryParam.driver = driver
      this.$refs.table.refresh(true)
    },
    multiDel () {
      this.$confirm({
        title: '确定批量删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(this.selectedRowKeys.join(',')).then((res) => {
            this.$notification['success']({
              message: res.message,
              duration: 4
            })
            this.selectedRowKeys = []
            this.handleOk()
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
