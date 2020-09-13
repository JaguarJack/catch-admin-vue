<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        刷新
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="sync">
        同步微信菜单
      </el-button>
    </div>
    <el-table
      :data="data"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="item">
          {{ wechat_events[item.row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间">
        <template slot-scope="item">
          {{ formatLoginTime(item.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <el-button type="primary" icon="el-icon-plus" @click="handleBeforeCreate(item.row)" />
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(item.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(item.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!------------------------- 菜单 ------------------------------>
    <el-dialog :title="title" :visible.sync="formVisible" width="30%" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formFieldsData.name" style="width: 92%" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="formFieldsData.type" placeholder="请选择类型">
            <el-option
              v-for="(item, key) in wechat_events"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === 'view'" label="网页链接" :label-width="formLabelWidth" prop="url">
          <el-input v-model="formFieldsData.url" style="width: 92%" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === 'miniprogram'" label="小程序链接" :label-width="formLabelWidth" prop="miniprogram_link">
          <el-input v-model="formFieldsData.miniprogram_link" style="width: 92%" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === 'miniprogram'" label="小程序APPID" :label-width="formLabelWidth" prop="miniprogram_appid">
          <el-input v-model="formFieldsData.miniprogram_appid" style="width: 92%" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === 'miniprogram'" label="小程序页面" :label-width="formLabelWidth" prop="miniprogram_page">
          <el-input v-model="formFieldsData.miniprogram_page" style="width: 92%" autocomplete="off" clearable />
        </el-form-item>
        <el-input v-model="formFieldsData.parent_id" type="hidden" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  mixins: [formOperate],
  data() {
    return {
      formName: 'wechatMenus',
      formLabelWidth: '120px',
      formFieldsData: {
        name: '',
        type: 'click',
        url: '',
        miniprogram_link: '',
        miniprogram_appid: '',
        miniprogram_page: '',
        parent_id: 0
      },
      url: 'wechat/official/menus',
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
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型' }
        ],
        url: [
          { required: true, message: '请输入网页跳转链接' }
        ],
        miniprogram_link: [
          { required: true, message: '请输入小程序链接' }
        ],
        miniprogram_appid: [
          { required: true, message: '请输入小程序 appid' }
        ],
        miniprogram_page: [
          { required: true, message: '请输入小程序页面' }
        ]
      }
    }
  },
  methods: {
    formatLoginTime(time) {
      return parseTime(time)
    },
    handleBeforeCreate(item) {
      this.formFieldsData.parent_id = item.id
      this.handleCreate()
      this.formFieldsData.type = 'click'
    },
    sync() {
      this.$http.post('wechat/official/menus/sync').then(res => {
        this.$message.success(res.message)
        this.handleRefresh()
      })
    },
    beforeSubmit() {
      if (this.formFieldsData.type === 'view') {
        this.formFieldsData.miniprogram_appid =
          this.formFieldsData.miniprogram_link =
            this.formFieldsData.miniprogram_page = ''
      } else if (this.formFieldsData.type === 'miniprogram') {
        this.formFieldsData.url = ''
      } else {
        this.formFieldsData.miniprogram_appid =
          this.formFieldsData.miniprogram_link =
            this.formFieldsData.miniprogram_page =
              this.formFieldsData.url = ''
      }
    }
  }
}
</script>
