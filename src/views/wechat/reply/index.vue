<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryParam.rule_type" placeholder="请选择规则类型" clearable class="filter-item" style="margin-right: 5px">
        <el-option
          v-for="(item, key) in rule_types"
          :key="key"
          :label="item"
          :value="key"
        />
      </el-select>
      <el-select v-model="queryParam.type" placeholder="请选择类型" clearable class="filter-item" style="margin-right: 5px">
        <el-option
          v-for="(item, key) in types"
          :key="key"
          :label="item"
          :value="key"
        />
      </el-select>
      <el-select v-model="queryParam.status" clearable placeholder="请选择状态" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="启用" />
        <el-option value="2" label="禁用" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :data="data" tooltip-effect="dark" style="width: 100%" border fit>
      <el-table-column label="规则类型" prop="rule_type">
        <template slot-scope="rule">
          {{ rule_types[rule.row.rule_type] }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="rule">
          {{ types[rule.row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="rule">
          <el-switch
            v-model="rule.row.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="2"
            @change="disOrEnable(rule.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" />
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="rule">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(rule.row)">更新</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(rule.row.id)">删除</el-button>
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
    <!--------------------------------- 查看表结构 ------------------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible">
      <el-form :ref="formName" :rules="rules" :model="formFieldsData">
        <el-form-item label="回复类型" :label-width="formLabelWidth" prop="rule_type">
          <el-radio-group v-model="formFieldsData.rule_type" size="small">
            <el-radio-button v-for="(item, key) in rule_types" :key="key" :value="key" :label="key">
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formFieldsData.rule_type == 1" label="关键字" :label-width="formLabelWidth" prop="keyword">
          <el-input v-model="formFieldsData.keyword" placeholder="请输入关键字" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-select :value="formFieldsData.type" placeholder="请选择类型" @change="handleSelectType">
            <el-option
              v-for="(item, key) in types"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === '4'" label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="formFieldsData.title" placeholder="请输入标题" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === '4' || formFieldsData.type === '6'" label="上传音频" :label-width="formLabelWidth" prop="voice_url">
          <el-input v-model="formFieldsData.voice_url" placeholder="请输入音频链接" autocomplete="off" clearable />
          <el-upload
            class="upload-voice"
            :action="fileAction"
            :headers="headers"
            :on-success="handleVoiceSuccess"
            :before-upload="beforeVoiceUpload"
          >
            <el-button size="small" icon="el-icon-plus" type="primary">点击上传音频</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === '5'" label="上传视频" :label-width="formLabelWidth" prop="video_url">
          <el-input v-model="formFieldsData.video_url" placeholder="请输入视频链接" autocomplete="off" clearable />
          <el-upload
            class="upload-video"
            :action="fileAction"
            :headers="headers"
            :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
          >
            <el-button size="small" icon="el-icon-plus" type="primary">点击上传音频</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === '1' || formFieldsData.type === '4' || formFieldsData.type === '5' || formFieldsData.type === '7'" label="内容" :label-width="formLabelWidth" prop="content">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="formFieldsData.content">
          </el-input>
        </el-form-item>
        <el-form-item v-if="formFieldsData.type === '3' || formFieldsData.type === '4'" label="上传图片" :label-width="formLabelWidth" prop="image_url">
          <el-upload
            class="avatar-uploader"
            name="image"
            :action="imageAction"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload">
            <img v-if="formFieldsData.image_url" :src="formFieldsData.image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
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
import { getToken } from '@/utils/auth'

export default {
  mixins: [formOperate],
  data() {
    return {
      formLabelWidth: '120px',
      url: 'wechat/official/reply',
      formName: 'wechatReply',
      queryParam: {
        rule_type: '',
        type: '',
        status: ''
      },
      headers: {
        authorization: 'Bearer ' + getToken()
      },
      imageAction: process.env.VUE_APP_BASE_API + '/wechat/official/upload/image',
      fileAction: process.env.VUE_APP_BASE_API + '/wechat/official/upload/file',
      formFieldsData: {
        rule_type: 1,
        keyword: '',
        type: '1',
        content: '',
        image_url: '',
        title: '', // 音频标题
        voice_url: '', // 音频链接
        video_url: ''
      },
      rule_types: {
        1: '关键字',
        2: '关注回复',
        3: '默认回复'
      },
      types: {
        1: '文字',
        // 2:'图文',
        3: '图片',
        4: '音乐',
        5: '视频',
        6: '语音',
        7: '转客服'
      },
      rules: {
        keyword: [
          { required: true, message: '请输入关键字' }
        ],
        content: [
          { required: true, message: '请输入内容' }
        ],
        image_url: [
          { required: true, message: '请上传图片' }
        ],
        title: [
          { required: true, message: '请输入标题' }
        ],
        voice_url: [
          { required: true, message: '请上传音频' }
        ],
        video_url: [
          { required: true, message: '请上传视频' }
        ]
      }
    }
  },
  methods: {
    handleSelectType(value) {
      this.formFieldsData.type = value
      this.$refs[this.formName].clearValidate()
    },
    disOrEnable(rule) {
      this.$http.put('wechat/official/reply/enable/' + rule.id).then(response => {
        this.$message.success(response.message)
      })
    },
    beforeUpdate(rule) {
      this.$http.get('wechat/official/reply/' + rule.id).then(response => {
        this.formFieldsData.rule_type = response.data.rule_type
        this.formFieldsData.keyword = response.data.keyword
        this.formFieldsData.type = String(response.data.type)
        this.formFieldsData.image_url = response.data.image_url
        this.formFieldsData.title = response.data.title
        this.formFieldsData.video_url = response.data.video_url
        this.formFieldsData.voice_url = response.data.voice_url
      })
    },
    beforeSubmit() {
      if (this.formFieldsData.rule_type !== '1') {
        this.formFieldsData.keyword = ''
      }
      // 文字类型
      if (this.formFieldsData.type === '1' || this.formFieldsData.type === '7') {
        this.formFieldsData.image_url =
           this.formFieldsData.title =
             this.formFieldsData.voice_url =
               this.formFieldsData.video_url = ''
      }
      // 图片类型
      if (this.formFieldsData.type === '3') {
        this.formFieldsData.content =
          this.formFieldsData.title =
            this.formFieldsData.voice_url =
              this.formFieldsData.video_url = ''
      }
      // 音频
      if (this.formFieldsData.type === '4') {
        this.formFieldsData.video_url = ''
      }
      // 视频
      if (this.formFieldsData.type === '5') {
        this.formFieldsData.title =
            this.formFieldsData.image_url =
              this.formFieldsData.video_url = ''
      }
      if (this.formFieldsData.type === '6') {
        this.formFieldsData.title =
          this.formFieldsData.image_url =
            this.formFieldsData.video_url =
              this.formFieldsData.content = ''
      }
    },
    beforeImageUpload(file) {
      const image = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif'
      if (!image) {
        this.$message.error('只支持 jpg/jpeg/png/gif 格式!')
      }
      let isLtSize = false
      if (this.formFieldsData.type === '3') {
        isLtSize = file.size / 1024 / 1024 < 5
        if (!isLtSize) {
          this.$message.error('最大支持 5MB!')
        }
      } else {
        isLtSize = file.size / 1024 < 64
        if (!isLtSize) {
          this.$message.error('音乐封面最大支持 64KB!')
        }
      }
      return image && isLtSize
    },
    beforeVoiceUpload(file) {
      const isMp3 = file.type.indexOf('mp4') !== -1 && file.type.indexOf('amr') !== -1
      if (!isMp3) {
        this.$message.error('视频格式只支持 MP3/AMR 格式')
      }
      const isMax2M = file.size / 1024 / 1024 < 2
      if (!isMax2M) {
        this.$message.error('视频格式最大支持 10MB!')
      }
      return isMp3 && isMax2M
    },
    beforeVideoUpload(file) {
      const isMp4 = file.type.indexOf('mp4') !== -1
      if (!isMp4) {
        this.$message.error('视频格式只支持 MP4 格式')
      }
      const isMax10M = file.size / 1024 / 1024 < 10
      if (!isMax10M) {
        this.$message.error('视频格式最大支持 10MB!')
      }
      return isMp4 && isMax10M
    },
    handleImageSuccess(response, file, fileList) {
      this.formFieldsData.image_url = response.data
    },
    handleVoiceSuccess(response, file, fileList) {
      this.formFieldsData.voice_url = response.data
    },
    handleVideoSuccess(response, file, fileList) {
      this.formFieldsData.video_url = response.data
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
