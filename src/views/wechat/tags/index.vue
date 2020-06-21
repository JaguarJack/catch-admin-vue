<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="4" :sm="24">
                        <a-input allowClear v-model="queryParam.name" placeholder="请输入标签名"/>
                    </a-col>
                    <a-col :md="4" :sm="24">
                        <span class="table-page-search-submitButtons">
                         <a-button icon="search" type="primary" @click="$refs.table.refresh(true)" >查询</a-button>
                         <a-button icon="sync" style="margin-left: 8px" @click="sync" :loading="syncLoading">同步微信标签</a-button>
                          <a-button type="primary" style="margin-left: 8px"  icon="plus" @click="showTagForm(null)">新增</a-button>
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
            showPagination="auto"
        >
         <span slot="option" slot-scope="text, record">
            <a-tag color="green" @click="showTagForm(record)">更新</a-tag>
             <a-tag color="red" @click="deleteTag(record)">删除</a-tag>
        </span>
        </s-table>
        <a-modal title="标签" :width="650" :visible="tagVisible" :confirmLoading="confirmLoading" @ok="tagSubmit" @cancel="modalCancel">
            <a-form :form="tagForm">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标签">
                    <a-input allowClear v-decorator="['name', {rules: [{required: true, min:1, max:30, message: '请输入备注, 最大输入三十个字符！'}]}]" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-card>
</template>

<script>
  import { STable } from '@/components'
  import pick from 'lodash.pick'

  export default {
    name: 'index',
    components: {
      STable
    },
    data () {
      return {
        queryParam: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        confirmLoading: false,
        tagVisible: false,
        tagForm: this.$form.createForm(this),
        syncLoading: false,
        id: null,
        // 表头
        columns: [
          {
            title: '标签ID',
            dataIndex: 'tag_id',
          },
          {
            title: '标签名称',
            dataIndex: 'name',
          },
          {
            title: '粉丝数量',
            dataIndex: 'fans_amount',
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'option' },
            width:250
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('wechat/official/tags', Object.assign(parameter, this.queryParam) ).then(res => {
            return res
          })
        },
      }
    },
    methods: {
      handleOk () {
        this.$refs.table.refresh(true)
      },
      resetSearchForm() {
        this.queryParam = {}
        this.handleOk()
      },
      sync () {
         this.syncLoading = true
         this.$http.get('wechat/official/tags/sync').then(res => {
             this.toast(res)
             this.syncLoading = false
         })
      },
      showTagForm(record) {
        if (record) {
          this.id = record.tag_id
          this.tagForm.setFieldsValue(record)
        }
        this.tagVisible = true
      },
      deleteTag(record) {
        this.$confirm({
          title: '确定删除【' + record.name + '】标签吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.$http.delete('wechat/official/tags/' + record.tag_id).then((res) => {
              this.toast(res)
              this.handleOk()
            })
          },
        })
      },
      tagSubmit () {
        const { tagForm: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            if (!this.id) {
              this.$http.post('wechat/official/tags', values)
                .then((res) => {
                  this.toast(res)
                  this.handleOk()
                  this.modalCancel()
                })
            } else {
              this.$http.put('wechat/official/tags/' + this.id, values)
                .then((res) => {
                  this.toast(res)
                  this.handleOk()
                  this.modalCancel()
                })
            }
          }
        })
      },
      modalCancel () {
        this.tagVisible = false
        if (this.id) {
          this.id = null
          this.tagForm.resetFields()
        }
      }
    }
  }
</script>
