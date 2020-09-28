<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.name" placeholder="任务名称" clearable class="filter-item form-search-input" />
      <el-select v-model="queryParam.status" clearable placeholder="请选择执行状态" class="filter-item" style="margin-right: 5px">
        <el-option value="1" label="启用" />
        <el-option value="2" label="禁用" />
      </el-select>
      <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <router-link to="/monitor/crontab/log">
        <el-button class="filter-item" type="danger" icon="el-icon-guide" style="margin-left: 5px">
          日志
        </el-button>
      </router-link>
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate()">
        新增
      </el-button>
    </div>
    <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
      批量删除
    </el-button>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" prop="id" width="80" />
      <el-table-column label="名称" prop="name" />
      <el-table-column prop="group" label="分组">
        <template slot-scope="cron">
          {{ cron.row.group === 1 ? '默认' : '系统' }}
        </template>
      </el-table-column>
      <el-table-column prop="task" label="调用目标类" />
      <el-table-column prop="cron" label="cron表达式" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="cron">
          <el-switch
            v-model="cron.row.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="2"
            @change="disOrEnableCron(cron.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作" width="220">
        <template slot-scope="cron">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(cron.row)" />
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(cron.row.id)" />
          <router-link :to="'/monitor/crontab/log/' + cron.row.id" style="margin-left: 5px">
            <el-button size="small" icon="el-icon-guide">日志</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total" />
    <!----------------------------------- 任务 ---------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible" width="40%" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formFieldsData.name" style="width: 92%" placeholder="请输入任务名称" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="分组" :label-width="formLabelWidth">
          <el-radio v-model="formFieldsData.group" :label="1" checked>默认</el-radio>
          <el-radio v-model="formFieldsData.group" :label="2">系统</el-radio>
        </el-form-item>
        <el-form-item label="调用任务类" :label-width="formLabelWidth" prop="task">
          <el-input v-model="formFieldsData.task" style="width: 92%" placeholder="请输入类名称" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="cron 表达式" :label-width="formLabelWidth" prop="cron">
          <el-input v-model="formFieldsData.cron" style="width: 92%" placeholder="请输入 cron 表达式" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="执行策略" :label-width="formLabelWidth">
          <el-radio v-model="formFieldsData.status" :label="1" checked>启用</el-radio>
          <el-radio v-model="formFieldsData.status" :label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="formFieldsData.tactics" :label="1" checked>立即执行</el-radio>
          <el-radio v-model="formFieldsData.tactics" :label="2">执行一次</el-radio>
          <el-radio v-model="formFieldsData.tactics" :label="3">放弃执行</el-radio>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input type="textarea" v-model="formFieldsData.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'

export default {
  mixins: [formOperate],
  data() {
    return {
      formName: 'crontab',
      formLabelWidth: '120px',
      // 用户搜索
      queryParam: {
        name: '',
        status: ''
      },
      formVisible: false,
      formFieldsData: {
        name: '',
        group: 1,
        task: '',
        cron: '',
        tactics: 1,
        status: 1,
        remark: ''
      },
      url: 'monitor/crontab',
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { max: 100, message: '最大支持 100 个字符', trigger: 'blur' }
        ],
        task: [
          { required: true, message: '请输入调用目标类', trigger: 'blur' },
          { pattern: /^[a-zA-Z]+$/, message: '类名称支持英文', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    disOrEnableCron(cron) {
      this.$http.put(this.url + '/' + cron.id).then(response => {
        this.$message.success(response.message)
      })
    }
  }
}
</script>
