<template>
    <div>
        <a-modal
            :title="title"
            :width="500"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
            <a-spin :spinning="confirmLoading">
                <a-form :form="form">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="菜单名称"
                    >
                        <a-input allowClear v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入名称, 至少2个字符！'}]}]" />
                    </a-form-item>
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="菜单类型"
                    >
                        <a-select allowClear v-decorator="['type', {initialValue: 'click'}, {rules: [{required: true}]}]" style="width: 100%" @change="handleSelect">
                            <a-select-option v-for="(item, key) in wechat_events" :value="key">
                                {{ item }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- 微信打开页面 -->
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="跳转网页"
                        v-if="this.show.view"
                    >
                        <a-input allowClear v-decorator="['url', {rules: [{required: true, min: 2, message: '请输入网页URL'}]}]" />
                    </a-form-item>
                    <!-- 微信打开小程序 -->
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="小程序链接"
                        v-if="this.show.miniprogram"
                    >
                        <a-input allowClear v-decorator="['miniprogram_link', {rules: [{required: true, min: 2, message: '请输入小程序链接'}]}]" />
                    </a-form-item>
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="小程序APPID"
                        v-if="this.show.miniprogram"
                    >
                        <a-input allowClear v-decorator="['miniprogram_appid', {rules: [{required: true, min: 2, message: '请输入小程序APPID'}]}]" />
                    </a-form-item>
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="小程序页面"
                        v-if="this.show.miniprogram"
                    >
                        <a-input allowClear v-decorator="['miniprogram_page', {rules: [{required: true, min: 2, message: '请输入小程序页面'}]}]" />
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-modal>
    </div>
</template>

<script>
  export default {
    name: 'create',
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
        title: '新增菜单',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        show: {
          view: false,
          miniprogram: false,
        },
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
        }
      }
    },
    methods: {
      add(key) {
        this.visible = true
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.$emit('add', values)
            this.handleCancel()
          }
        })
      },

      handleCancel() {
        this.visible = false
      },

      handleSelect(value, option) {
        if (value === 'view') {
          this.show.view = true
          this.show.miniprogram = false
        } else if (value === 'miniprogram') {
          this.show.view = false
          this.show.miniprogram = true
        } else {
          this.show.miniprogram = this.show.view = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
