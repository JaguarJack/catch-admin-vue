<template>
  <div>
    <a-modal
      :title="title"
      :width="740"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-row>
            <a-col :span="12">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="类型"
              >
                <a-radio-group :disabled="disabled" buttonStyle="solid" @change="hide" v-decorator="['type',{initialValue: typeValue},{rules: [{required: true}]}]">
                  <a-radio-button :value="1">菜单</a-radio-button>
                  <a-radio-button :value="2">按钮</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="0">
            <a-col :span="12">
              <a-form-item
                label="菜单名称"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input allowClear v-decorator="['permission_name', {rules: [{required: true, min: 2, message: '请输入菜单名称, 至少2个字符！'}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="权限标识"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :filterOption="filterOption"
              >
                <a-input allowClear v-decorator="['permission_mark',{rules: [{required: true, min: 2, message: '请输入权限标识, 至少2个字符！'}]}]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="0" v-if="show">
            <a-col :span="12">
              <a-form-item
                label="模块"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input allowClear v-decorator="['module', {rules: [{required: true, min: 2, message: '请输入模块, 至少2个字符！'}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="菜单图标"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input v-decorator="['icon']" @click="selectIcon" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="0" v-if="show">
            <a-col :span="12">
              <a-form-item
                label="菜单Path"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input allowClear v-decorator="['route', {rules: [{required: true, min: 2, message: '请输入菜单路由, 至少2个字符！'}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="组件名称"
              >
                <a-select allowClear placeholder="选择组件" v-decorator="['component', {initialValue:componentValue}, {rules: [{required: true}]}]">
                  <a-select-opt-group v-for="(item, key) in components" :key="key" :label="key">
                    <a-select-option v-for="(v, k) in item" :key="k" :value="v">{{ v }}</a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="0" >
            <a-col :span="12" v-if="show">
              <a-form-item
                label="Redirect"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input allowClear v-decorator="['redirect', {initialValue: redirect}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="排序"
              >
                <a-input-number :min="1" v-decorator="['sort', {initialValue: sort}]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="0" v-if="show">
            <a-col :span="12">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="KeepAlive"
              >
                <a-radio-group buttonStyle="solid" v-decorator="['keepalive', {initialValue: keepalive},{rules: [{required: true}]}]">
                  <a-radio-button :value="1">是</a-radio-button>
                  <a-radio-button :value="2">否</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="隐藏子菜单"
              >
                <a-radio-group buttonStyle="solid" v-decorator="['hide_children_in_menu',{initialValue: hideChildrenInMenu},{rules: [{required: true}]}]">
                  <a-radio-button :value="1">是</a-radio-button>
                  <a-radio-button :value="2">否</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal title="选择图标" v-model="iconVisible">
      <icon-selector zIndex="2000" :width="1200" v-model="currentSelectedIcon" @change="handleIconChange"/>
    </a-modal>
  </div>
</template>

<script>
import { store, update } from '@/api/permission'
import pick from 'lodash.pick'
import IconSelector from '@/components/IconSelector'
import { httpMethods } from '@/enums/data/httpMethods'
import { components } from '@/enums/data/components'

export default {
  components: {
    IconSelector
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      title: '新建菜单',
      confirmLoading: false,
      id: null,
      parent_id: 0,
      typeValue: 1,
      form: this.$form.createForm(this),
      sort: 1,
      currentSelectedIcon: '',
      iconVisible: false,
      httpMethods: httpMethods,
      components: components,
      keepalive: 1, // 是
      componentValue: '',
      redirect: '',
      hideChildrenInMenu: 2,
      show: true,
      disabled: false, // 类型选择
    }
  },
  methods: {
    selectIcon () {
      this.iconVisible = true
    },
    handleIconChange (icon) {
      // this.$message.info(<span>选中图标 <code>{icon}</code></span>)
      this.form.setFieldsValue({
        icon: icon
      })
      this.iconVisible = false
    },
    add () {
      this.visible = true
      this.show = true
      this.title = '新增菜单'
    },
    edit (record) {
      this.visible = true
      this.disabled = false
      this.show = record.type === 1
      this.title = '编辑菜单'
      const { form: { setFieldsValue } } = this
      this.id = record.id
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['permission_name', 'route', 'module', 'permission_mark', 'method', 'type', 'keepalive','sort', 'icon']))
      })
      this.typeValue = record.type
      this.sort = record.sort
      this.componentValue = record.component
      this.redirect = record.redirect
    },
    addSon (record) {
      this.visible = true
      this.show = true
      this.title = '新增子菜单 (' + record.permission_name + ')'
      this.parent_id = record.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
          setFieldsValue(pick(record, [ 'module']))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      if (this.id) {
        validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            if (values.component === undefined) {
              values.component = ''
            }
            update(this.id, values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
          }
        })
      } else {
        validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            if (this.parent_id > 0) {
              values['parent_id'] = this.parent_id
            }
            store(values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
          }
        })
      }
    },
    failed (errors) {
      this.$notification['error']({
        message: errors.message,
        duration: 4
      })
      this.handleCancel()
    },
    handleCancel () {
      this.visible = false
      this.id = null
      this.confirmLoading = false
      this.parent_id = 0
      this.typeValue = 1
      this.sort = 1
      this.form.resetFields()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    refresh (message) {
      this.$notification['success']({
        message: message,
        duration: 4
      })
      this.handleCancel()
      this.$parent.$parent.handleOk()
    },
    hide (e) {
      this.show = e.target.value === 1
    }
  }
}
</script>
