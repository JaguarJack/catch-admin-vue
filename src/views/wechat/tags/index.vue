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
                         <a-button icon="search" type="primary" @click="handleRefresh" >查询</a-button>
                         <a-button icon="sync" style="margin-left: 8px" @click="sync">同步微信标签</a-button>
                          <a-button type="primary" style="margin-left: 8px"  icon="plus" @click="handleSave">新增</a-button>
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
             <a-tag color="green" @click="handleUpdate(record)">更新</a-tag>
             <a-tag color="red" @click="handleDelete(record)">删除</a-tag>
        </span>
        </s-table>
        <a-modal :title="title" :width="650" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleHidden">
            <a-form :form="form">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标签">
                    <a-input allowClear v-decorator="['name', {rules: [{required: true, min:1, max:30, message: '请输入备注, 最大输入三十个字符！'}]}]" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-card>
</template>

<script>
  import { STable } from '@/components'
  import mixinCurd from '@/utils/mixins/mixinCurd'

  export default {
    mixins: [mixinCurd],
    name: 'index',
    components: {
      STable
    },
    data () {
      return {
        url: 'wechat/official/tags',
        pk: 'tag_id',
        syncLoading: true,
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
      }
    },
    methods: {
      sync () {
         this.syncLoading = true
         this.$http.get('wechat/official/tags/sync').then(res => {
             this.toast(res)
             this.handleOk()
             this.syncLoading = false
         })
      },
    }
  }
</script>
