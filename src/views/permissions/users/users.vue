<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :rowKey="(record) => record.data.key"
          :dataSource="departments"
          :openKeys="expandedKeys"
          @click="handleClick"
        >
        </s-tree>
      </a-col>
      <a-col :span="19">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="4" :sm="24">
                <a-input allowClear v-model="queryParam.username" placeholder="请输入用户名"/>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-input allowClear v-model="queryParam.email" placeholder="请输入邮箱"/>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-select allowClear v-model="queryParam.status" placeholder="请选择状态" default-value="0">
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">禁用</a-select-option>
                </a-select>
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
          <a-button type="primary" icon="plus" @click="$refs.userModal.add()">新建</a-button>
          <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item @click="multiDel()"><a-icon type="delete"/>删除</a-menu-item>
              <!-- lock | unlock -->
              <a-menu-item @click="multiAble()"><a-icon type="lock"/>启用/禁用</a-menu-item>
            </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
          </a-dropdown>
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
      <span slot="status" slot-scope="text,record">
        <template>
          <a-switch
            checkedChildren="启用"
            :value="record.id"
            unCheckedChildren="禁用"
            @change="onSwitchClick"
            v-if="text === 1"
            defaultChecked/>
          <a-switch checkedChildren="启用" v-else :value="record.id" unCheckedChildren="禁用" @change="onSwitchClick"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </template>
      </span>
    </s-table>
    </a-col>
    </a-row>
    <create-user ref="userModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import CreateUser from './form/create'
import { swtichStatus, del, getUserList } from '@/api/user'
import { getDepartmentList } from '@/api/departments'
import { expandKeys } from '@/utils/util'

export default {
  name: 'Users',
  components: {
    STable,
    STree,
    CreateUser
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      expandedKeys: [],
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
          // customRender: this.renderStatus
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
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
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      departments: []
    }
  },
  created () {
    getDepartmentList().then(res => {
      const departments = this.addKey(res.data)
      const keys = []
      expandKeys(departments, keys)
      keys.sort().map(item => {
        this.expandedKeys.push(String(item))
      })
      console.log(this.expandedKeys)
      this.departments = departments
    })
  },
  methods: {
    handleEdit (record) {
      this.$refs.userModal.edit(record)
    },
    handleDel (record) {
      this.$confirm({
        title: '确定删除' + record.username + '吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(record.id).then((res) => {
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
    multiDel () {
      this.$confirm({
        title: '确定批量删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(this.selectedRowKeys.join(',')).then((res) => {
            this.toast(res)
            this.selectedRowKeys = []
            this.handleOk()
          })
        },
        onCancel () {}
      })
    },
    multiAble () {
      this.onSwitchStatus(this.selectedRowKeys.join(','))
    },
    onSwitchStatus (id) {
      swtichStatus(id).then((res) => {
        this.toast(res)
        this.onSelectChange([], [])
        this.handleOk()
      })
    },
    onSwitchClick (checked, event) {
      let id = event.target.value
      if (!id) {
        id = event.target.offsetParent.value
      }
      this.onSwitchStatus(id)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    resetSearchForm () {
      this.queryParam = {}
      this.handleOk()
    },
    handleClick (e) {
      this.queryParam.department_id = e.key
      this.$refs.table.refresh(true, this.queryParam)
    },
    addKey (departments) {
      departments.map(item => {
        item.key = String(item.id)
        if (item.children !== undefined) {
          this.addKey(item.children)
        }
      })
      return departments
    }
  }
}
</script>
