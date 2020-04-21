<template>
   <div>
      <a-card :bordered="true" style="width: 100%">
         <a-form :form="form">
            <a-divider orientation="left">站点配置</a-divider>
            <a-form-item label="站点名称" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="site.name">
                  <a-input placeholder="站点名称" allowClear v-decorator="['site.name', {rules: [{required: true, message: '请输入站点名称'}]}]"/>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="站点链接" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="site.url">
                  <a-input placeholder="站点链接" allowClear  v-decorator="['site.url']"/>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="站点开始时间" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="site.start_at">
                  <a-date-picker placeholder="站点开始时间" style="width: 100%"  allowClear v-decorator="['site.start_at']"></a-date-picker>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="站点关键字" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="site.keywords">
                  <a-input placeholder="站点关键字" allowClear  v-decorator="['site.keywords']"/>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="站点描述" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="site.description">
                  <a-input type="textarea"  placeholder="站点描述" allowClear v-decorator="['site.description']"/>
               </a-tooltip>
            </a-form-item>
            <a-divider orientation="left">底部信息</a-divider>
            <a-form-item label="备案号" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="footer.record_number">
                  <a-input placeholder="备案号" allowClear  v-decorator="['footer.record_number']"/>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="版权信息" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="footer.copyright">
                  <a-input placeholder="版权信息" allowClear  v-decorator="['footer.copyright']"/>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="底部联系方式" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="footer.contact">
                  <a-input placeholder="底部联系方式" allowClear  v-decorator="['footer.contact']"/>
               </a-tooltip>
            </a-form-item>
            <a-form-item label="备案号链接地址" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="footer.record_url">
                  <a-input placeholder="备案号链接地址" allowClear  v-decorator="['footer.record_url']"/>
               </a-tooltip>
            </a-form-item>
            <a-divider orientation="left">其他配置</a-divider>
            <a-form-item label="黑名单IP" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
               <a-tooltip placement="right" title="blacklist">
                  <a-textarea placeholder="黑名单IP，IP 逗号隔开" allowClear v-decorator="['blacklist']"/>
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
import { store,show } from '@/api/config'
import pick from 'lodash.pick'
import moment from 'moment';
import { resetConfig } from '@/utils/util'

export default {
   name: 'basic',
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
         initialData['site.start_at'] = moment(initialData['site.start_at'])
         const { form: { setFieldsValue } } = this
         this.$nextTick(() => {
            setFieldsValue(pick(initialData, Object.keys(initialData)))
         })
      })
   },
   methods: {
      moment,
      submit () {
         const { form: { validateFields } } = this
         validateFields((errors, values) => {
            // 时间格式化
            values.site.start_at = moment(values.site.start_at).format('YYYY-MM-DD')
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
