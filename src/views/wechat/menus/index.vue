<template>
    <a-card :bordered="false">
        <a-row :gutter="8">
            <a-col :span="18">
                <div class="table-page-search-wrapper">
                    <a-form layout="inline">
                        <div class="table-operator">
                            <a-button type="primary" icon="plus" @click="add(null)">新建</a-button>
                            <a-button icon="sync" style="margin-left: 8px" @click="refresh">刷新</a-button>
                            <a-button icon="sync" style="margin-left: 8px" @click="sync" :loading="syncLoading">同步微信标签</a-button>
                        </div>
                    </a-form>
                </div>
                <s-table
                    ref="table"
                    size="default"
                    rowKey="id"
                    :columns="columns"
                    :data="loadData"
                    :defaultExpandedRowKeys="expandedKeys"
                    :showPagination="false"
                >
                    <span slot="type" slot-scope="text, record">
                        <a-tag >{{ wechat_events[record.type] }}</a-tag>
                    </span>
                    <span slot="option" slot-scope="text, record">
                        <a-tag color="blue" @click="add(record.id)">新增</a-tag>
                        <a-tag color="green" @click="edit(record)">更新</a-tag>
                        <a-tag color="red" @click="del(record.id)">删除</a-tag>
                    </span>
                    <span slot="createdAt" slot-scope="text, record">
                        {{ date(record.created_at) }}
                    </span>
                </s-table>

            </a-col>
            <a-col :span="6">
               <!-- <we-chat title="CatchAdmin 微信公众号" :menus="menus"/>-->
            </a-col>
        </a-row>
        <create-menu ref="menuModel" @refresh="refresh"/>
    </a-card>
</template>

<script>
  import CreateMenu from './create'
  import { STable } from '@/components'
  import { expandKeys } from '@/utils/util'
  import { timestampToDate } from '@/utils/date'

  export default {
    name: 'index',
    components: { CreateMenu, STable },
    data() {
      return {
        expandedKeys: [], // 展开ID
        menus:[],
        syncLoading: false,
        columns: [
          {
            title: '菜单名称',
            dataIndex: 'name',
            width: '200px'
          },
          {
            title: '类型',
            scopedSlots: { customRender: 'type' },
          },
          {
            title: '创建事件',
            scopedSlots: { customRender: 'createdAt' },
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'option' },
          },
        ],
        wechat_events: {
          'click': '点击推送',
          'view': '跳转网页',
          'miniprogram': '小程序',
          'scancode_push': '扫码推送',
          'scancode_waitmsg': '扫码推事件且弹出“消息接收中”提示框',
          'pic_sysphoto': '弹出系统拍照发图',
          'pic_photo_or_album': '弹出拍照或者相册发图',
          'pic_weixin': '弹出微信相册发图器',
          'location_select': '弹出地理位置选择器',
          'media_id': '下发消息（除文本消息)',
          'view_limited': '跳转图文消息'
        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('wechat/official/menus')
            .then(res => {
              expandKeys(res.data, this.expandedKeys)
              this.menus = res.data
              return res
            })
        }
      }
    },
    methods: {
      add(id) {
        this.$refs.menuModel.add(id)
      },
      edit(data) {
          this.$refs.menuModel.edit(data)
      },
      del(id) {
         this.$http.delete('wechat/official/menus/'+id).then(res => {
            this.toast(res)
            this.refresh()
         })
      },
      date (timestamp) {
         return timestampToDate(timestamp)
      },
      refresh() {
        this.$refs.table.refresh(true)
      },
      sync() {
        this.syncLoading = true
        this.$http.post('wechat/official/menus/sync').then(res => {
            this.syncLoading = false
            this.toast(res)
            this.refresh()
        })
      }
    }
  }
</script>

<style scoped>

</style>
