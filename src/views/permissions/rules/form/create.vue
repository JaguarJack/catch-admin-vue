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
                v-if="this.showType"
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
                :label="name"
                type="text"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input allowClear v-decorator="['permission_name', {rules: [{required: true, min: 2, message: '请输入名称, 至少2个字符！'}]}]" />
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
                <span v-if="!this.show">{{ this.permissionMarkValue }}</span>
                <a-input-group v-if="!this.show"  compact style="width: 60%;margin-left: 3px">
                  <a-auto-complete :data-source="methods"  placeholder="method" v-decorator="['permission_mark',{rules: [{required: true, min: 2, message: '请输入权限标识 至少两个字符'}]}]" />
                </a-input-group>
                <a-input v-else placeholder="格式controller@method" allowClear v-decorator="['permission_mark',{rules: [{required: true, min: 2, message: '请输入权限标识 至少两个字符'}]}]" />
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
                <a-select show-search allowClear placeholder="选择组件" v-decorator="['component', {initialValue:componentValue}, {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, key) in components" :key="key" :value="key" :label="key">
                    {{ key }}
                  </a-select-option>
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
import { store as add, update } from '@/api/permission'
import pick from 'lodash.pick'
import IconSelector from '@/components/IconSelector'
import { httpMethods } from '@/enums/data/httpMethods'
import componentsMap  from '@/config/componentsMap'
import { refreshMenus } from '@/utils/util'

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
      name: '菜单名称',
      form: this.$form.createForm(this),
      sort: 1,
      currentSelectedIcon: '',
      iconVisible: false,
      httpMethods: httpMethods,
      components: componentsMap,
      keepalive: 1, // 是
      componentValue: '',
      redirect: '',
      hideChildrenInMenu: 2,
      show: true,
      disabled: false, // 类型选择
      permissionMarkValue: '',
      methods: [],
      showType: true
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
    add (showType = true) {
      this.visible = true
      this.show = true
      this.title = '新增菜单'
      this.showType = showType
    },
    edit (rec) {
      const record = rec
      this.visible = true
      this.disabled = false
      this.show = record.type === 1
      this.title = '编辑菜单'
      const { form: { setFieldsValue } } = this
      this.id = record.id
      // permission_mark
      let permissionMark = record.permission_mark
      if (!this.show) {
          this.getMethods(record.parent_id)
          const mark = record.permission_mark.split('@')
          this.permissionMarkValue = mark[0] + '@'
          permissionMark = mark[1]
      }
      this.$nextTick(() => {
        setFieldsValue(pick({
          permission_name: record.permission_name,
          route: record.route,
          module: record.module,
          permission_mark: permissionMark,
          method: record.method,
          type: record.type,
          keepalive: record.keepalive,
          sort: record.sort,
          icon: record.icon
        }, ['permission_name', 'route', 'module', 'permission_mark', 'method', 'type', 'keepalive','sort', 'icon']))
      })
      this.typeValue = record.type
      this.sort = record.sort
      this.componentValue = record.component
      this.redirect = record.redirect
    },
    addSon (record) {
      this.visible = true
      this.show = !record.parent_id
      this.getMethods(record.id)
      this.typeValue = record.parent_id ? 2 : 1
      this.title = '新增子菜单 (' + record.permission_name + ')'
      this.parent_id = record.id
      this.permissionMarkValue = record.permission_mark.split('@')[0] + '@'
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
            update(this.id, this.permissionMarkChange(values)).then((res) => {
              this.refresh(res)
              refreshMenus()
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
            add(this.permissionMarkChange(values)).then((res) => {
              this.refresh(res)
              refreshMenus()
            }).catch(err => this.failed(err))
          }
        })
      }
    },
    getMethods(id) {
      this.$http.get('controller/methods/'+id).then((res) => {
          this.methods = res.data
      })
    },
    handleCancel () {
      this.visible = false
      this.id = null
      this.confirmLoading = false
      this.parent_id = 0
      this.typeValue = 1
      this.sort = 1
      this.permissionMarkValue = ''
      this.form.resetFields()
      this.methods = []
      this.showType = true
    },
    permissionMarkChange(values) {
      if (values.type === 2 && this.permissionMarkValue) {
          values.permission_mark = this.permissionMarkValue + values.permission_mark
      }
      return values
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    refresh (res) {
      this.toast(res)
      this.handleCancel()
      this.$parent.$parent.handleOk()
    },
    hide (e) {
      this.show = e.target.value === 1
      this.name = e.target.value === 1 ? '菜单名称' : '按钮名称'
    }
  }
}
</script>
