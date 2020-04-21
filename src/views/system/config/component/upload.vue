<template>
    <div>
        <a-card :bordered="true" style="width: 100%">
            <a-form :form="form">
                <a-divider orientation="left">阿里OSS配置</a-divider>
                <a-form-item label="prefix" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="oss.prefix">
                        <a-input placeholder="prefix" allowClear v-decorator="['oss.prefix']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="access_key" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="oss.access_key">
                        <a-input placeholder="access_key" allowClear v-decorator="['oss.access_key']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="secret_key" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="oss.secret_key">
                        <a-input placeholder="secret_key" allowClear  v-decorator="['oss.secret_key']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="bucket" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="oss.bucket">
                        <a-input placeholder="bucket" allowClear  v-decorator="['oss.bucket']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="end_point" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="oss.end_point">
                        <a-input placeholder="end_point" allowClear  v-decorator="['oss.end_point']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="is_cname" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="oss.is_cname">
                        <a-radio-group name="oss.is_cname" v-decorator="['oss.is_cname', {initialValue: 0}]">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-tooltip>
                </a-form-item>
                <a-divider orientation="left">七牛云配置</a-divider>
                <a-form-item label="access_key" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qiniu.access_key">
                        <a-input placeholder="access_key" allowClear  v-decorator="['qiniu.access_key']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="secret_key" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qiniu.secret_key">
                        <a-input placeholder="secret_key" allowClear  v-decorator="['qiniu.secret_key']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="bucket" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qiniu.bucket">
                        <a-input placeholder="bucket" allowClear  v-decorator="['qiniu.bucket']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="domain" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qiniu.domain">
                        <a-input placeholder="domain" allowClear  v-decorator="['qiniu.domain']"/>
                    </a-tooltip>
                </a-form-item>
                <a-divider orientation="left">腾讯云配置</a-divider>
                <a-form-item label="region" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.region">
                        <a-input placeholder="region" allowClear  v-decorator="['qcloud.region']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="app_id" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.app_id">
                        <a-input placeholder="app_id" allowClear  v-decorator="['qcloud.app_id']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="secret_id" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.secret_id">
                        <a-input placeholder="secret_id" allowClear  v-decorator="['qcloud.secret_id']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="secret_key" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.secret_key">
                        <a-input placeholder="secret_key" allowClear  v-decorator="['qcloud.secret_key']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="region" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.region">
                        <a-input placeholder="region" allowClear  v-decorator="['qcloud.region']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="bucket" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.bucket">
                        <a-input placeholder="bucket" allowClear  v-decorator="['qcloud.bucket']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="timeout" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.timeout">
                        <a-input placeholder="timeout" allowClear  v-decorator="['qcloud.timeout', {initialValue: 60}]"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="connect_timeout" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.connect_timeout">
                        <a-input placeholder="connect_timeout" allowClear  v-decorator="['qcloud.connect_timeout', {initialValue: 60}]"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="cdn" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.cdn">
                        <a-input placeholder="cdn" allowClear  v-decorator="['qcloud.cdn']"/>
                    </a-tooltip>
                </a-form-item>
                <a-form-item label="scheme" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-tooltip placement="right" title="qcloud.scheme">
                    <a-input placeholder="scheme" allowClear  v-decorator="['qcloud.scheme', {initialValue: 'https'}]"/>
                </a-tooltip>
                </a-form-item>
                <a-form-item label="read_from_cdn" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-tooltip placement="right" title="qcloud.read_from_cdn">
                        <a-radio-group name="qcloud.read_from_cdn" v-decorator="['qcloud.read_from_cdn', {initialValue: 0}]">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-tooltip>
                </a-form-item>

                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" style="text-align: center">
                    <a-button type="primary" @click="submit">保存</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script>
import pick from 'lodash.pick'
import { resetConfig } from '@/utils/util'

  export default {
    name: 'upload',
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 10 }
        },
        form: this.$form.createForm(this),
      }
    },
    created () {
      this.$emit('show', res => {
        let initialData = resetConfig(res.data)
        const { form: { setFieldsValue } } = this
        initialData['oss.is_cname'] = parseInt(initialData['oss.is_cname'])
        this.$nextTick(() => {
          setFieldsValue(pick(initialData, Object.keys(initialData)))
        })
      })
    },
    methods: {
      submit () {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.$emit('store', values)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
