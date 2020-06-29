<template>
    <div>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="4" :sm="24">
                        <a-select allowClear v-model="queryParam.rule_type" placeholder="规则类型" default-value="1">
                            <a-select-option :value="key"  v-for="(item, key) in rule_types" :key="key">{{ item }}</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="4" :sm="24">
                        <a-select allowClear v-model="queryParam.type" placeholder="类型" default-value="1">
                            <a-select-option v-for="(item, key) in types" :value="key" :key="key" >{{ item }}</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-range-picker  :placeholder="['开始时间', '结束时间']"/>
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
        <a-button icon="plus" type="primary" @click="formShow">新增</a-button>
        <s-table
            ref="table"
            size="default"
            rowKey="id"
            :bordered="true"
            :columns="columns"
            :data="loadData"
            showPagination="auto"
        >
         <span slot="rule_type" slot-scope="text, record">
            {{ rule_types[record.rule_type] }}
         </span>
         <span slot="type" slot-scope="text, record">
            {{ types[record.type] }}
         </span>
         <span slot="status" slot-scope="text, record">
            <template>
              <a-switch
                  checked-children="启用"
                  :value="record.id"
                  un-checked-children="禁用"
                  @change="onSwitchClick"
                  v-if="record.status === 1"
                  default-checked/>
              <a-switch checked-children="启用" v-else :value="record.id" un-checked-children="禁用" @change="onSwitchClick"/>
            </template>
         </span>
        </s-table>
    </a-card>
    <a-modal title="备注" :width="650" :visible="form.visible" :confirmLoading="form.confirmLoading" @ok="formSubmit" @cancel="formCancel">
        <a-form :form="createForm">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="回复类型">
                <a-radio-group v-decorator="['rule_type', {initialValue:form.ruleTypeValue}, {rules: [{required: true}]}]" button-style="solid" @change="handleRuleChange">
                    <a-radio-button :value="key" v-for="(item, key) in rule_types" :key="key">
                        {{ item }}
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="关键字" v-if="form.keywordsShow">
                <a-input allowClear v-decorator="['keyword', {rules: [{required: true, min:1, max:30, message: '请输入关键字'}]}]" />
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类型">
                <a-select allowClear placeholder="类型" v-decorator="['type', {initialValue:form.typeValue}, {rules: [{required: true}]}]" @change="handleTypeChange">
                    <a-select-option v-for="(item, key) in types" :value="key" :key="key">{{ item }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标题" v-if="form.titleShow">
                <a-input allowClear v-decorator="['title', {rules: [{required: true, min:1, max:30, message: '请输入标题'}]}]" />
            </a-form-item>
            <!-- upload video-->
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="上传" v-if="form.uploadedVideoShow">
                <a-input allowClear placeholder="请填写视频链接或者上传" v-decorator="['media_url', {rules: [{required: true, message: '请填写视频链接或者上传'}]}]" />
                <a-upload
                    name="file"
                    :action="form.fileAction"
                    :headers="form.headers"
                    :show-upload-list="false"
                    @change="handleUploadVideo"
                    :beforeUpload="beforeUploadVideo"
                >
                    <a-button> <a-icon type="upload" />上传视频 </a-button>
                </a-upload>
            </a-form-item>

            <!-- upload mp3/voice -->
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="上传" v-if="form.uploadedVoiceShow">
                <a-input allowClear placeholder="请填写音频链接或者上传" v-decorator="['media_url', {rules: [{required: true, message: '请填写音频链接或者上传'}]}]" />
                <a-upload
                    name="file"
                    :action="form.fileAction"
                    :headers="form.headers"
                    :show-upload-list="false"
                    @change="handleUploadVoice"
                    :beforeUpload="beforeUploadVoice"
                >
                    <a-button> <a-icon type="upload" />上传音频</a-button>
                </a-upload>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内容" v-if="form.contentShow">
                <a-textarea v-decorator="['content', {rules: [{required: true, min:1, max:30, message: '请输入内容'}]}]" :auto-size="{ minRows: 2, maxRows: 6 }"/>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="上传" v-if="form.uploadImageShow">
                <a-input style="display: none" v-decorator="['image_url', {rules: [{required: true,  message: '请上传图片'}]}]" />
                <a-upload
                    name="image"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :action="form.imageAction"
                    :before-upload="beforeUploadImage"
                    @change="handleUploadImage"
                    :headers="form.headers"
                >
                    <img v-if="form.imageUrl" :src="form.imageUrl" alt="avatar" style="width: 100px"/>
                    <div v-else>
                        <div class="ant-upload-text">上传图片</div>
                    </div>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-modal>
    </div>
</template>

<script>
  import { STable } from '@/components'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  export default {
    name: 'index',
    components: {STable},
    data() {
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
        createForm: this.$form.createForm(this),
        form: {
          fileAction: process.env.VUE_APP_API_BASE_URL + '/upload/file',
          imageAction: process.env.VUE_APP_API_BASE_URL + '/upload/image',
          visible: false,
          confirmLoading: false,
          headers: {
            'authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
          },
          typeValue: '1',
          ruleTypeValue: '3',
          keywordsShow: false,
          titleShow: false,
          contentShow: false,
          uploadImageShow: false,
          mediaList: [],
          imageList: [],
          uploadedVideoShow: false,
          uploadedVoiceShow: false,
          imageUrl: '',
          videoUrl: '',
          voiceUrl: ''
        },

        rule_types: {
          1: '关键字',
          2: '关注回复',
          3: '默认回复',
        },
        types: {
          1:'文字',
         // 2:'图文',
          3:'图片',
          4:'音乐',
          5:'视频',
          6:'语音',
          7:'转客服',
        },
        columns: [
          {
            title: '规则类型',
            scopedSlots: { customRender: 'rule_type' },
          },
          {
            title: '类型',
            scopedSlots: { customRender: 'type' },
          },
          {
            title: '状态',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '创建人',
            dataIndex: 'creator'
          },
          {
            title: '创建时间',
            dataIndex: 'created_at'
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'rule_type' },
          },
        ],
        loadData: parameter => {
          return this.$http.get('wechat/official/reply', Object.assign(parameter, this.queryParam) )
            .then(res => {
              return res
            })
        },
      }
    },
    methods: {
      resetSearchForm () {
        this.queryParam = {}
        this.handleOk()
      },
      handleOk () {
        this.$refs.table.refresh(true)
      },
      formSubmit () {
        const { createForm: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.$http.post('wechat/official/reply', values)
              .then((res) => {
                this.toast(res)
                this.handleOk()
                this.formCancel()
              })
          }
        })
      },
      formCancel () {
        this.form.visible = this.form.keywordsShow = false
        this.form.keywordsShow = false
        this.form.titleShow = false
        this.form.contentShow = false
        this.form.uploadImageShow = this.form.uploadedVoiceShow = this.form.uploadedVideoShow = false
        this.form.imageUrl = ''
        this.form.mediaList = this.form.imageList = []
        this.createForm.resetFields()
      },
      formShow () {
        this.form.visible = true
      },
      handleRuleChange (e) {
        this.form.keywordsShow = e.target.value === "1"
      },
      onSwitchClick (checked, event) {
        let id = event.target.value
        if (!id) {
          id = event.target.offsetParent.value
        }
        // this.onSwitchStatus(id)
      },
      handleTypeChange (v, option) {
        this.form.titleShow = v === '4' || v === '5'
        this.form.contentShow = v === '4' || v === '5' || v === '1' || v === '7'
        // 图片
        this.form.uploadImageShow = v === '4' || v === '3'
        // 视频
        this.form.uploadedVideoShow = v === '5'
        // 音频
        this.form.uploadedVoiceShow = v === '4' || v === '6'
        if (v === '4') {
          this.createForm.resetFields()
        }
      },
      beforeUploadVideo (file) {
        const isMp4 = file.type.indexOf('mp4') !== -1
        if (!isMp4) {
          this.$message.error('视频格式只支持 MP4 格式');
        }
        const isMax10M = file.size / 1024 / 1024 < 10;
        if (!isMax10M) {
          this.$message.error('视频格式最大支持 10MB!');
        }
        return isMp4 && isMax10M
      },
      beforeUploadVoice (file) {
        const isMp3 = file.type.indexOf('mp4') !== -1 && file.type.indexOf('amr') !== -1
        if (!isMp3) {
          this.$message.error('视频格式只支持 MP3/AMR 格式');
        }
        const isMax2M = file.size / 1024 / 1024 < 2;
        if (!isMax2M) {
          this.$message.error('视频格式最大支持 10MB!');
        }
        return isMp3 && isMax2M
      },
      beforeUploadImage (file) {
        const image = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        if (!image) {
          this.$message.error('只支持 jpg/jpeg/png/gif 格式!');
        }
        let isLtSize = false;
        if (this.createForm.getFieldValue('type') === '3') {
          isLtSize = file.size / 1024 / 1024 < 10;
          if (!isLtSize) {
            this.$message.error('最大支持 10MB!');
          }
        } else {
          isLtSize = file.size / 1024 < 64;
          if (!isLtSize) {
            this.$message.error('音乐封面最大支持 64KB!');
          }
        }
        return image && isLtSize;
      },
      handleUploadVideo (info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.createForm.setFieldsValue({media_url: info.file.response.data})
          this.loading = false
        }
      },
      handleUploadVoice (info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.createForm.setFieldsValue({media_url: info.file.response.data})
          this.loading = false
        }
      },
      handleUploadImage (info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.form.imageUrl = info.file.response.data
          const { createForm: { setFieldsValue } } = this
          setFieldsValue({image_url: info.file.response.data})
          this.loading = false
        }
      },
    }
  }
</script>

<style scoped>

</style>
