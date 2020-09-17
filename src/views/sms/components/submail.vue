<template>
  <el-row :getter="24">
    <el-col :span="6">
      <el-form :model="submail" :rules="rules" ref="submail" label-width="100px">
        <el-form-item label="app_id" prop="app_id">
          <el-input v-model="submail.app_id"></el-input>
        </el-form-item>
        <el-form-item label="app_key" prop="app_key">
          <el-input v-model="submail.app_key"></el-input>
        </el-form-item>
        <el-form-item label="project" prop="project">
          <el-input v-model="submail.project"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :span="14">
      <el-button class="filter-item mb-5" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增模版
      </el-button>
      <el-table  :data="data" tooltip-effect="dark" style="width: 100%" border fit>
        <el-table-column label="模版名称" prop="name" />
        <el-table-column prop="identify" label="模版标识" />
        <el-table-column prop="code" label="模版CODE" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作">
          <template slot-scope="template">
            <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(template.row)" />
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(template.row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <!------------------------------------- 模版 ------------------------------------------------>
      <el-dialog :title="title" :visible.sync="formVisible" width="30%" @close="handleCancel">
        <el-form :ref="formName" :model="formFieldsData" :rules="templateRules">
          <el-form-item label="模版名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formFieldsData.name" style="width: 92%" placeholder="请输入模版名称" autocomplete="off" clearable />
          </el-form-item>
          <el-form-item label="模版标识" :label-width="formLabelWidth" prop="identify">
            <el-input v-model="formFieldsData.identify" style="width: 92%" placeholder="请输入模版标识" autocomplete="off" clearable />
          </el-form-item>
          <el-form-item label="模版CODE" :label-width="formLabelWidth" prop="code">
            <el-input v-model="formFieldsData.code" style="width: 92%" placeholder="请输入模版code" autocomplete="off" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      submail: {
        name: 'submail',
        app_id: '',
        app_key: '',
        project: 'project'
      },
      rules: {
        app_id: [
          { required: true, message: 'app_id 必须填写', trigger: 'blur' }
        ],
        app_key: [
          { required: true, message: 'app_key 必须填写', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '项目必须填写', trigger: 'blur' }
        ]
      },
      // 模版
      data: [],
      formLabelWidth: '120px',
      formVisible: false,
      formFieldsData: {
        name: '',
        identify: '',
        code: ''
      },
      formName: 'template',
      url: '/sms/template',
      queryParam: {
        operator: 'submail'
      },
      defaultQueryParam: ['operator'],
      templateRules: {
        name: [
          { required: true, message: '模版名称必须填写', trigger: 'blur' }
        ],
        identify: [
          { required: true, message: '模版标识必须填写', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '模版CODE必须填写', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$http.get('/sms/config/' + this.submail.name).then(response => {
      Object.keys(this.submail).forEach(key => {
        if (response.data[key] !== undefined) {
          this.submail[key] = response.data[key]
        }
      })
    })
  },
  methods: {
    submit() {
      this.$refs['submail'].validate(valid => {
        if (valid) {
          this.$http.post('sms/config', this.submail).then(response => {
            this.$message.success(response.message)
          })
        }
      })
    },
    beforeSubmit() {
      this.formFieldsData.operator = 'submail'
    }
  }
}
</script>

<style scoped>

</style>
