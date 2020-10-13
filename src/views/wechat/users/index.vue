<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.nickname" placeholder="请输入用户名" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.block" clearable placeholder="请选择状态" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="正常" />
        <el-option value="2" label="拉黑" />
      </el-select>
      <el-select v-model="queryParam.subscribe" clearable placeholder="请选择订阅状态" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="是" />
        <el-option value="0" label="否" />
      </el-select>
      <el-date-picker
        class="filter-item"
        v-model="queryParam.start_at"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"/>
      <el-date-picker
        class="filter-item"
        v-model="queryParam.end_at"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束时间"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button icon="el-icon-refresh" class="filter-item" type="warning" @click="sync">
        同步用户
      </el-button>
    </div>
    <el-table :data="data" tooltip-effect="dark" style="width: 100%" border fit>
      <el-table-column label="昵称" width="150" prop="nickname">
        <template slot-scope="user">
          <el-avatar :src="user.row.avatar"/>
          {{ user.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="80">
        <template slot-scope="user">
          <el-tag v-if="user.row.sex === 2" type="danger">女</el-tag>
          <el-tag v-else-if="user.row.sex === 1" type="primary">男</el-tag>
          <el-tag v-else>为知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="地区" width="150">
        <template slot-scope="user">
          <el-tag size="small">{{ user.row.country }} / {{ user.row.province }}{{ user.row.city ? ' / ' + user.row.city : '' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="150" />
      <el-table-column prop="language" label="语言" />
      <el-table-column prop="screen" label="关注场景" width="100">
        <template slot-scope="user">
          {{ screen[user.row.subscribe_scene] }}
        </template>
      </el-table-column>
      <el-table-column prop="block" label="拉黑" width="150">
        <template slot-scope="user">
          <el-switch
            v-model="user.row.block"
            active-text="正常"
            inactive-text="拉黑"
            :active-value="1"
            :inactive-value="2"
            @change="blockUser(user.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="subscribe" label="订阅" width="90">
        <template slot-scope="user">
          <el-tag v-if="user.row.subscribe === 2">取消订阅</el-tag>
          <el-tag v-else>订阅中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="subscribe_time" label="订阅时间" width="160">
        <template slot-scope="user">
          {{ formatTime(user.row.subscribe_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="user">
          <el-button size="small" type="success" @click="remarked(user.row)">备注</el-button>
          <el-button size="small" type="primary" @click="taged(user.row)">打标签</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      class="pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"/>
    <!--------------------------------- remark ------------------------------------------------------->
    <el-dialog title="备注" :visible.sync="remark.visiable" width="40%">
      <el-form :ref="remark.formname" :model="remark" :rules="remark.rules">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="form.remark">
          <el-input v-model="remark.form.remark" placeholder="请输入备注" autocomplete="off" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remark.visiable = false">取 消</el-button>
        <el-button type="primary" @click="remarkSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--------------------------------- tag ------------------------------------------------------->
    <el-dialog title="备注" :visible.sync="tag.visiable" width="30%">
      <el-form :ref="tag.formname" :model="remark" :rules="tag.rules">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="form.tag">
          <el-select
            v-model="tag.form.tag"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择用户标签">
            <el-option
              v-for="item in tag.select"
              :key="item.id"
              :label="item.name"
              :value="item.tag_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tagSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'
import { parseTime } from '@/utils'
export default {
  mixins: [formOperate],
  data() {
    return {
      url: 'wechat/official/users',
      formLabelWidth: '120px',
      formName: '',
      queryParam: {
        nickname: '',
        block: '',
        subscribe: '',
        start_at: '',
        end_at: ''
      },
      // 备注
      remark: {
        visiable: false,
        rules: {
          'form.remark': [
            { required: true, message: '请输入备注', trigger: 'blur' }
          ]
        },
        formname: 'remark',
        form: {
          remark: ''
        },
        user_id: ''
      },
      // 打标签
      tag: {
        visiable: false,
        rules: {
          'form.tag': [
            { required: true, message: '请输入标签', trigger: 'blur' }
          ]
        },
        formname: 'tag',
        form: {
          tag: []
        },
        user_id: '',
        select: []
      },
      screen: {
        'ADD_SCENE_SEARCH': '公众号搜索',
        'ADD_SCENE_ACCOUNT_MIGRATION': '公众号迁移',
        'ADD_SCENE_PROFILE_CARD': '名片分享',
        'ADD_SCENE_QR_CODE': '扫描二维码',
        'ADD_SCENE_PROFILE_LINK': '图文页内名称点击',
        'ADD_SCENE_PROFILE_ITEM': '图文页右上角菜单',
        'ADD_SCENE_PAID': '支付后关注',
        'ADD_SCENE_WECHAT_ADVERTISEMENT': '微信广告',
        'ADD_SCENE_OTHERS': '其他'
      },
      rules: [
        { required: true, message: '请输入标签名称', trigger: 'blur' },
        { max: 30, message: '最大支持 30 个字符', trigger: 'blur' }
      ]
    }
  },
  methods: {
    sync() {
      this.$http.get('wechat/official/tags/sync').then(res => {
        this.$message.success(res.message)
        this.handleRefresh()
      })
    },
    // 拉黑用户
    blockUser(user) {
      this.$http.put('wechat/official/users/block/' + user.id).then(function(res) {})
    },
    // 格式化时间
    formatTime(time) {
      return parseTime(time)
    },
    remarked(user) {
      this.remark.user_id = user.id
      this.remark.visiable = true
      this.remark.form.remark = user.remark
    },
    remarkSubmit() {
      if (this.remark.form.remark) {
        this.$http.put('wechat/official/users/remark/' + this.remark.user_id + '/' + this.remark.form.remark).then(response => {
          this.remark.visiable = false
          this.handleRefresh()
        })
      }
    },
    taged(user) {
      this.$http.get('wechat/official/tags?all=all').then(res => {
        this.tag.select = res.data
      })
      this.tag.user_id = user.id
      this.tag.visiable = true
      this.tag.form.tag = user.tagid_list.split(',')
    },
    tagSubmit() {
      if (this.tag.form.tag.length > 0) {
        this.$http.put('wechat/official/users/tag/' + this.tag.user_id,
          { 'tag': this.tag.form.tag.join(',') }).then(res => {
          this.tag.visiable = false
          this.handleRefresh()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
