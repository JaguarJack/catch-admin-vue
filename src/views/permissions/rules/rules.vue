<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-input allowClear v-model="queryParam.permission_name" placeholder="请输入菜单名名称"/>
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
      <a-button type="primary" icon="plus" @click="$refs.permissionModal.add()">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :defaultExpandedRowKeys="expandedKeys"
      :data="loadData"
      :showPagination="false"
    >
      <span slot="actions" slot-scope="text, record">
        <a-popover title="操作" trigger="click" v-for="(action, index) in record.actionList" :key="index">
          <template slot="content">
            <p>权限标识: {{ record.permission_mark }}</p>
            <p>
              <a-button type="primary" size="small" @click="handleEdit(action)"><a-icon type="edit" /> 编辑</a-button>
              <a-button type="danger" size="small" @click="handleDel(action)"><a-icon type="delete" /> 删除</a-button>
            </p>
          </template>
          <a-tag>{{ action.permission_name }}</a-tag>
        </a-popover>
      </span>
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
    <create-permission ref="permissionModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreatePermission from './form/create'
import { getPermissionList, del } from '@/api/permission'
import { expandKeys } from '@/utils/util'

export default {
  name: 'Permissions',
  components: {
    STable,
    CreatePermission
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      expandedKeys: [], // 展开ID
      // 表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'permission_name',
          width: '200px'
        },
        {
          title: '路由path',
          dataIndex: 'route'
        },
        {
          title: '权限标识',
          dataIndex: 'permission_mark'
        },
        {
          title: '可操作权限',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.actionList = 'actionList';
        return getPermissionList(Object.assign(parameter, this.queryParam))
          .then(res => {
            expandKeys(res.data, this.expandedKeys)
            return res
          })
      }
    }
  },
  methods: {
    handleEdit (record) {
      this.$refs.permissionModal.edit(record)
    },
    handleAddSon (record) {
      this.$refs.permissionModal.addSon(record)
    },
    handleDel (record) {
      this.$confirm({
        title: '确定删除' + record.permission_name + '吗?',
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
    }
  }
}
</script>
