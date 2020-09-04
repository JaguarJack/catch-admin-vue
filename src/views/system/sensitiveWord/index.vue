<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.word" placeholder="用户名" clearable class="filter-item form-search-input" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button class="filter-item fr" type="primary" icon="el-icon-plus" @click="handleCreate()">
        新增
      </el-button>
      <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
        批量删除
      </el-button>
    </div>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="敏感词" width="120" prop="word" />
      <el-table-column prop="creator" label="创建人" width="300" />
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="updated_at" label="更新时间" />
      <el-table-column label="操作">
        <template slot-scope="word">
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(word.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(word.row.id)" />
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
      :total="paginate.total"/>
    <!----------------------------------- 部门 ---------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="敏感词" :label-width="formLabelWidth" prop="word">
          <el-input v-model="formFieldsData.word" placeholder="请输入敏感词" autocomplete="off" clearable />
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
      formName: 'words',
      formLabelWidth: '120px',
      // 用户搜索
      queryParam: {
        word: '',
      },
      formVisible: false,
      formFieldsData: {
        word: ''
      },
      url: 'sensitive/word',
      // 表单验证
      rules: {
        word: [
          { required: true, message: '请输入敏感词', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
