<template>
    <div>
        <a-card :bordered="false" :bodyStyle="{'height' : 'auto'}">
            <a-card :bordered="false">
                <a-button type="primary" @click="add">新增配置</a-button>
            </a-card>
            <a-tabs v-model="activeKey" type="card" >
                <a-tab-pane v-for="pane in panes" :tab="pane.name" :key="pane.id">
                    <component :is="components[pane.component]" :pid="activeKey" @show="showData" @store="storeData"></component>
                </a-tab-pane>
            </a-tabs>
        </a-card>
        <a-modal
            :title="title"
            :width="540"
            :visible="modelVisible"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
            <a-form :form="form">
                <a-form-item
                    label="配置名称"
                    type="text"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['name', {rules: [{required: true, message: '请输入配置名称'}]}]"/>
                </a-form-item>
                <a-form-item
                    label="配置键名"
                    type="text"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['key', {rules: [{required: true, message: '请输入配置键名'}]}]"/>
                </a-form-item>
                <a-form-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="组件"
                >
                    <a-select allowClear placeholder="选择组件" v-decorator="['component', {initialValue:componentValue}, {rules: [{required: true}]}]">
                        <a-select-option v-for="(v, k) in components" :key="k" :value="k">{{ k }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { getParent, store, show } from '@/api/config'

export default {
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        panes: [],
        newTabIndex: 0,
        form: this.$form.createForm(this),
        modelVisible: false,
        activeKey:0,
        title: '新增配置',
        components: {
          'upload': () => import('./component/upload.vue'),
          'basis': () => import('./component/basis')
        },
        componentValue: ''
      };
    },
    created () {
        getParent().then(res => {
          this.panes = res.data
          this.activeKey = this.panes[0] === undefined ? 0 : this.panes[0].id
        })
    },
    methods: {
      add() {
        this.modelVisible = true
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            store(values).then(res => {
              this.$message.success(res.message)
              this.handleCancel()
              this.activeKey = parseInt(res.data.id)
            })
          }
        })
      },
      storeData(values) {
        store({
          config: JSON.stringify(values),
          pid: this.activeKey,
        }).then(res => {
          this.$message.success(res.message)
        })
      },
      showData (callback) {
         show(this.activeKey).then(res=>{
           callback(res)
         })
      },
      handleCancel () {
        this.modelVisible = false
        this.form.resetFields()
      }
    },
};
</script>
