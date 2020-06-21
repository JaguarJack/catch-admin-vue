<template>
    <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="4" :sm="24">
                            <a-input allowClear v-model="queryParam.nickname" placeholder="请输入用户名"/>
                        </a-col>
                        <a-col :md="4" :sm="24">
                            <a-select allowClear v-model="queryParam.block" placeholder="选择拉黑状态" default-value="0">
                                <a-select-option value="1">正常</a-select-option>
                                <a-select-option value="2">拉黑</a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :md="4" :sm="24">
                            <a-select allowClear v-model="queryParam.subscribe" placeholder="选择订阅状态" default-value="0">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-range-picker  @change="onChange" :placeholder="['订阅开始时间', '订阅结束时间']"/>
                        </a-col>
                        <a-col :md="4" :sm="24">
                            <span class="table-page-search-submitButtons">
                             <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                             <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
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
        <span slot="subscribe_time" slot-scope="text, record">
            {{ toDate(record.subscribe_time) }}
        </span>
        <span slot="sex" slot-scope="text, record">
            <a-tag color="pink" v-if="record.sex === 2">女</a-tag>
            <a-tag color="blue" v-else-if="record.sex === 1">男</a-tag>
            <a-tag v-else>未知</a-tag>
        </span>
        <span slot="nickname" slot-scope="text, record">
            <a-avatar :src="record.avatar" />  {{ record.nickname }}
        </span>
        <span slot="area" slot-scope="text, record">
            <a-tag>{{ record.country }}</a-tag>
            <a-tag>{{ record.province }}</a-tag>
            <a-tag v-if="record.city">{{ record.city }}</a-tag>
        </span>
        <span slot="screen" slot-scope="text, record">
            {{ screen[record.subscribe_scene]}}
        </span>
        <span slot="language" slot-scope="text, record">
            <a-tag >{{ record.language }}</a-tag>
        </span>
         <span slot="block" slot-scope="text, record">
             <template>
              <a-switch
                  checked-children="启用"
                  :value="record.id"
                  un-checked-children="拉黑"
                  @change="blockUser"
                  v-if="record.block === 1"
                  default-checked/>
              <a-switch checked-children="启用" v-else :value="record.id" un-checked-children="拉黑" @change="blockUser"/>
            </template>
        </span>
        <span slot="subscribe" slot-scope="text, record">
            <a-badge status="processing" text="是" v-if="record.subscribe === 1"/>
            <a-badge status="default" text="否" v-else/>
        </span>
        <span slot="option" slot-scope="text, record">
            <a-tag color="blue" @click="showRemarkForm(record)">备注</a-tag>
            <a-tag color="green">打标签</a-tag>
        </span>
    </s-table>
    <a-modal title="备注" :width="650" :visible="remarkVisible" :confirmLoading="confirmLoading" @ok="remarkSubmit" @cancel="modalCancel">
        <a-form :form="remarkForm">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
                <a-input allowClear v-decorator="['remark', {rules: [{required: true, min:1, max:30, message: '请输入备注, 最大输入三十个字符！'}]}]" />
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal title="标签" :width="650" :visible="tagVisible" :confirmLoading="confirmLoading" @ok="tagSubmit" @cancel="modalCancel">
        <a-form :form="remarkForm">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
                <a-input allowClear v-decorator="['remark', {rules: [{required: true, min:1, max:30, message: '请输入备注, 最大输入三十个字符！'}]}]" />
            </a-form-item>
        </a-form>
    </a-modal>
    </a-card>
</template>

<script>
  import { STable } from '@/components'
  import { timestampToDate } from '@/utils/date'
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
        remarkVisible: false,
        remarkForm: this.$form.createForm(this),
        tagVisible: false,
        tagForm: this.$form.createForm(this),
        id: null,
        screen: {
          'ADD_SCENE_SEARCH':'公众号搜索',
          'ADD_SCENE_ACCOUNT_MIGRATION':'公众号迁移',
          'ADD_SCENE_PROFILE_CARD': '名片分享',
          'ADD_SCENE_QR_CODE': '扫描二维码',
          'ADD_SCENE_PROFILE_LINK': '图文页内名称点击',
          'ADD_SCENE_PROFILE_ITEM': '图文页右上角菜单',
          'ADD_SCENE_PAID': '支付后关注',
          'ADD_SCENE_WECHAT_ADVERTISEMENT': '微信广告',
          'ADD_SCENE_OTHERS': '其他'
        },
        // 表头
        columns: [
          {
            title: '昵称',
            dataIndex: 'nickname',
            scopedSlots: {customRender: 'nickname'}
          },
          {
            title: '性别',
            dataIndex: 'sex',
            scopedSlots: { customRender: 'sex' },
            width:70
          },
          {
            title: '地区',
            scopedSlots: { customRender: 'area' },
          },
          {
            title: '标签',
            dataIndex: 'taglist',
            width:120
          },
          {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
            width:100
          },
          {
            title: '语言',
            scopedSlots: { customRender: 'language' },
            width:80
          },
          {
            title: '关注场景',
            scopedSlots: { customRender: 'screen' },
            width:120
          },
          {
            title: '拉黑',
            scopedSlots: { customRender: 'block' },
            width:100,
          },
          {
            title: '订阅',
            scopedSlots: { customRender: 'subscribe' },
            width:80
          },
          {
            title: '订阅时间',
            dataIndex: 'subscribe_time',
            scopedSlots: { customRender: 'subscribe_time' },
            sorter: true
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'option' },
            width:150
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('wechat/official/users', Object.assign(parameter, this.queryParam) ).then(res => {
                return res
            })
        },
      }
    },
    methods: {
      handleOk () {
        this.$refs.table.refresh(true)
      },
      toDate (timestamp) {
        return timestampToDate(timestamp * 1000)
      },
      onChange(date, dateString) {
        this.queryParam.start_at = dateString[0]
        this.queryParam.end_at = dateString[1]
      },
      resetSearchForm() {
         this.queryParam = {}
         this.handleOk()
      },
      blockUser(checked, event) {
        let id = event.target.value
        if (!id) {
          id = event.target.offsetParent.value
        }
        this.$http.put('wechat/official/users/block/'+id).then(function (res) {})
      },
      showRemarkForm(record) {
          this.id = record.id
          this.remarkVisible = true
          const { remarkForm: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(record, ['remark']))
          })
      },
      remarkSubmit () {
        const { remarkForm: { validateFields } } = this
        validateFields((errors, values) => {
            if (!errors) {
                this.$http.put('wechat/official/users/remark/'+this.id+'/'+values.remark)
                  .then((res) => {
                    this.toast(res)
                    this.handleOk()
                    this.modalCancel()
                  })
            }
        })
      },
      tagSubmit () {

      },
      modalCancel () {
        this.remarkVisible = this.tagVisible = false
        this.id = null
        this.remarkForm.resetFields()
        this.tagForm.resetFields()
      }
    }
  }
</script>
