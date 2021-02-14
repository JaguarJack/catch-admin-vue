<template>
  <div class="app-container">
    <header><h3>代码生成器</h3></header>
    <el-divider></el-divider>
    <el-form ref="coding" :model="generate" :rules="rules" style="width: 40%;margin: auto">
      <el-form-item label="模块" :label-width="formLabelWidth" prop="module">
        <el-input v-model="generate.module" placeholder="请输入模块名称" autocomplete="off" clearable @change="moduleChange">
          <template slot="append">
            <el-button slot="append" @click="moduleCreateVisible=true">
              创建模块
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="表名" :label-width="formLabelWidth" prop="table">
        <el-input v-model="generate.table" placeholder="请输入表名" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="模型" :label-width="formLabelWidth" prop="model">
        <el-input v-model="generate.model" placeholder="请输入模型" >
          <el-button slot="append" icon="el-icon-view" @click="preview('model')"/>
        </el-input>
      </el-form-item>
      <el-form-item label="控制器" :label-width="formLabelWidth" prop="controller">
        <el-input v-model="generate.controller" placeholder="请输入控制器名称" clearable>
          <el-button slot="append" icon="el-icon-view" @click="preview('controller')"/>
        </el-input>
        <el-tooltip class="item" effect="dark" content="restful路由会自动生成 {index, save, read, update, delete} 五个方法" placement="top-start">
          <el-checkbox v-model="generate.restful">RESTFUL 路由</el-checkbox>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-table :data="fields" tooltip-effect="dark" style="width: 100%" border>
      <el-table-column label="字段名称">
        <template slot-scope="field">
          <el-input v-model="field.row.field" placeholder="字段名称" autocomplete="off" clearable />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="field">
          <el-select  v-model="field.row.type" filterable placeholder="请选择" prop="type">
            <el-option-group
              v-for="group in types"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="(item, key) in group.options"
                :key="key"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="unsigned" label="unsigned" width="100">
        <template slot-scope="field">
          <el-checkbox v-model="field.row.unsigned"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="length" label="长度" width="200">
        <template slot-scope="field">
          <el-input-number v-model="field.row.length" :min="0" :max="1000000"  label="长度" controls-position="right"/>
        </template>
      </el-table-column>
      <el-table-column prop="nullable" label="NULL" width="100">
        <template slot-scope="field">
          <el-checkbox v-model="field.row.nullable"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="index" label="索引类型" >
        <template slot-scope="field">
          <el-select v-model="field.row.index" placeholder="请选择">
            <el-option
              v-for="item in indexes"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="default" label="默认值">
        <template slot-scope="field">
          <el-input v-model="field.row.default" placeholder="默认值"  autocomplete="off" clearable />
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="注释">
        <template slot-scope="field">
          <el-input v-model="field.row.comment" placeholder="注释" autocomplete="off" clearable />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="field">
          <el-button type="danger" icon="el-icon-delete" @click="deleteField(field.row.field)" />
        </template>
      </el-table-column>
    </el-table>
    <p>
      <el-checkbox v-model="table.created_at" label="created_at&updated_at"/>
      <el-checkbox v-model="table.soft_delete" label="deleted_at"/>
      <el-checkbox v-model="table.creator_id" label="creator_id"/>
      <el-input placeholder="id" v-model="table.primary_key" style="width: 150px;margin-left: 5px">
        <template slot="prepend">ID</template>
      </el-input>
      <el-select v-model="table.engine" placeholder="请选择" style="margin-left: 5px;">
        <el-option
          v-for="item in engines"
          :key="item"
          :label="item"
          :value="item"/>
      </el-select>
      <el-input v-model="table.comment" placeholder="表注释" style="width: 250px;margin-left: 5px;">
        <template slot="prepend">表注释</template>
      </el-input>
      <el-button type="primary" class="fr" icon="el-icon-plus" @click="addField">新增新段</el-button>
    </p>
    <el-divider></el-divider>
    <el-checkbox v-model="create.controller" label="创建控制器"/>
    <el-checkbox v-model="create.model" label="创建模型"/>
    <el-checkbox v-model="create.migration" label="创建表迁移"/>
    <el-checkbox v-model="create.table" label="创建表"/>
    <el-button class="fr" type="primary" @click="submit">提交</el-button>
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl">
      <pre v-highlightjs><code class="php">{{ preview_content }}</code></pre>
    </el-drawer>
    <el-dialog title="创建模块" :visible="moduleCreateVisible" :destroy-on-close="true" width="40%" @close="moduleCreateVisible = false">
      <create-module @close="closeCreateModule" />
    </el-dialog>
  </div>
</template>

<script>
import 'highlight.js/styles/atom-one-dark.css'
import CreateModule from './createModule'

export default {
  components: {
    CreateModule
  },
  data() {
    return {
      title: '代码生成器',
      formLabelWidth: '120px',
      moduleCreateVisible: false,
      generate: {
        module: '',
        controller: '',
        table: '',
        model: '',
        restful: true
      },
      create: {
        controller: true,
        model: true,
        migration: true,
        table: true
      },
      // 预览内容
      preview_content: '',
      drawerVisible: false,
      // rule
      rules: {
        module: [
          { required: true, message: '请输入模块名称', trigger: 'blur' }
        ]
      },
      // 索引选项
      indexes: [
        'unique', 'index', 'fulltext', 'spatial'
      ],
      engines: [
        'InnoDB', 'MyISAM', 'Memory'
      ],
      table: {
        primary_key: 'id',
        created_at: true,
        soft_delete: true,
        creator_id: true,
        engine: 'InnoDB',
        comment: ''
      },
      fields: [this.getColumn()],
      types: mysqlTypes
    }
  },
  methods: {
    deleteField(field) {
      this.fields = this.fields.filter(function(value, key) {
        return value.field !== field
      })
      console.log(this.fields)
    },
    closeCreateModule() {
      this.moduleCreateVisible = false
    },
    getColumn() {
      return {
        'field': '',
        'type': '',
        'length': 0,
        'nullable': false,
        'index': '',
        'default': '',
        'comment': '',
        'unsigned': false
      }
    },
    addField() {
      console.log(this.getColumn())
      this.fields.push(this.getColumn())
    },
    getData() {
      const params = {}
      params.controller = this.generate
      params.table_fields = this.fields
      params.table_extra = this.table
      // create 文件
      params.create_controller = this.create.controller
      params.create_model = this.create.model
      params.create_migration = this.create.migration
      params.create_table = this.create.table
      return {
        'data': JSON.stringify(params)
      }
    },
    moduleChange(value) {
      this.generate.controller = 'catchAdmin\\' + value + '\\controller\\'
      this.generate.model = 'catchAdmin\\' + value + '\\model\\'
    },
    submit() {
      this.$refs['coding'].validate((valid) => {
        if (valid) {
          this.$http.post('generate', this.getData()).then(response => {
            if (response.code === 10000) {
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          this.$message.error('error commit')
        }
      })
    },
    preview(type) {
      const data = this.getData()
      data.type = type
      this.$http.post('generate/preview', data).then(response => {
        this.preview_content = response.data
        this.drawerVisible = true
      })
    }
  }
}
const mysqlTypes = [
  {
    label: '数字',
    options: [
      { value: 'tinyint' },
      { value: 'smallint' },
      { value: 'mediumint' },
      { value: 'int' },
      { value: 'bigint' },
      { value: 'decimal' },
      { value: 'float' },
      { value: 'tinyint' },
      { value: 'double' },
      { value: 'bit' },
      { value: 'boolean' }
    ]
  },
  {
    label: '日期与时间',
    options: [
      { value: 'date' },
      { value: 'datetime' },
      { value: 'timestamp' },
      { value: 'time' },
      { value: 'year' }
    ]
  },
  {
    label: '文本',
    options: [
      { value: 'char' },
      { value: 'varchar' },
      { value: 'tinyText' },
      { value: 'char' },
      { value: 'text' },
      { value: 'mediumText' },
      { value: 'longText' },
      { value: 'binary' },
      { value: 'varbinary' },
      { value: 'tinyblob' },
      { value: 'blob' },
      { value: 'mediumblob' },
      { value: 'longblob' },
      { value: 'enum' },
      { value: 'set' }
    ]
  },
  {
    label: '空间',
    options: [
      { value: 'geometry' },
      { value: 'point' },
      { value: 'linestring' },
      { value: 'polygon' },
      { value: 'multipoint' },
      { value: 'multilinestring' },
      { value: 'multipolygon' },
      { value: 'geometrycollection' }
    ]
  },
  {
    label: 'json',
    options: [
      { value: 'json' }
    ]
  }
]
</script>

<style scoped>

</style>
