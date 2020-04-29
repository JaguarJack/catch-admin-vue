<template>
    <div>
        <a-divider></a-divider>
        <a-form :form="form">
            <a-row :gutter="0">
                <a-col :span="16">
                    <a-form-item
                        label="模块"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input allowClear @change="onChange" v-decorator="['module', {rules: [{required: true}]}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="0">
                <a-col :span="16">
                    <a-form-item
                        label="表名"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        >
                        <a-input allowClear v-decorator="['table']" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="0">
                <a-col :span="16">
                    <a-form-item
                        label="模型"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input allowClear v-decorator="['model']">
                            <a-icon slot="addonAfter" type="eye" @click="preview('model')"/>
                        </a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="0">
                <a-col :span="16">
                    <a-form-item
                        label="控制器名称"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input allowClear v-decorator="['controller']" >
                            <a-icon slot="addonAfter" type="eye" @click="preview('controller')"/>
                        </a-input>
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <span>自动生成 {index, save, read, update, delete} 五个方法</span>
                            </template>
                            <a-checkbox :checked="restful" @change="changeRestful">RESTFul 路由</a-checkbox>
                        </a-tooltip>
                        <a-checkbox :checked="other" @change="changeOther">其他方法</a-checkbox>
                    </a-form-item>
                </a-col>
                <a-col :span="8" v-if="other">
                    <a-tag v-for="(func, index) in other_function" :key="func"  :closable="true" @close="() => handleClose(func)">
                        {{ func }}
                    </a-tag>
                    <a-input
                        v-if="inputVisible"
                        ref="input"
                        type="text"
                        size="small"
                        :style="{ width: '78px' }"
                        :value="inputValue"
                        @change="handleInputChange"
                        @keyup.enter="handleInputConfirm"
                    />
                    <a-tooltip v-else placement="topLeft" >
                        <template slot="title">
                            <span>默认使用 GET 方法，指定请求方法，例如：Function/Post。这对自动生成路由文件很有帮助</span>
                        </template>
                    <a-tag @click="showInput" style="background: #fff; borderStyle: dashed;">
                        <a-icon type="plus" /> Other Function
                    </a-tag>
                    </a-tooltip>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script>
  export default {
    name: 'controller',
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
        form: this.$form.createForm(this),
        restful: true,
        other: false,
        inputVisible: false,
        inputValue: '',
        other_function: [],
      }
    },
    methods: {
      onChange (e) {
        if (e.target.value) {
          this.form.setFieldsValue({
            controller: 'catchAdmin\\' + e.target.value + '\\controller\\',
            model: 'catchAdmin\\' + e.target.value + '\\model\\',
          });
        } else {
          this.form.setFieldsValue({
            controller: '',
            model: '',
          });
        }
      },
      getControllerData () {
        let data = this.form.getFieldsValue()
        data.other_function = this.other_function
        data.restful = this.restful
        return data
      },
      changeOther (e) {
        this.other = e.target.checked
      },
      changeRestful (e) {
        this.restful = e.target.checked
      },
      handleInputConfirm() {
        const inputValue = this.inputValue;
        let tags = this.other_function;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        if (/^[a-zA-Z]{3,100}/.test(inputValue)) {
          Object.assign(this, {
            other_function: tags,
            inputVisible: false,
            inputValue: '',
          });
        } else {
          this.$message.error('方法名不符合，只允许字母组合')
        }
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(function() {
          this.$refs.input.focus();
        });
      },

      handleInputChange(e) {
        this.inputValue = e.target.value;
      },
      handleClose(removedTag) {
        this.other_function = this.other_function.filter(tag => tag !== removedTag);
      },
      preview (type) {
          this.$emit('preview', type)
      }
    }
  }
</script>

<style scoped>

</style>
