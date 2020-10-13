<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.name" placeholder="表名" clearable class="filter-item form-search-input" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleRefresh">
        重置
      </el-button>
      <el-button icon="el-icon-refresh" class="filter-item" type="warning" @click="sync">
        同步微信标签
      </el-button>

      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :data="data" tooltip-effect="dark" style="width: 100%" border fit>
      <el-table-column label="标签ID" width="150" prop="tag_id" />
      <el-table-column prop="name" label="标签名称" width="150"/>
      <el-table-column prop="fans_amount" label="粉丝数量" width="150"/>
      <el-table-column prop="created_at" label="创建时间" width="200"/>
      <el-table-column label="操作">
        <template slot-scope="tag">
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(tag.row)" />
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(tag.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      class="pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"/>
    <!--------------------------------- 查看表结构 ------------------------------------------------------->
    <el-dialog :title="title" :visible.sync="formVisible" @close="handleCancel">
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item label="岗位名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formFieldsData.name" placeholder="请输入标签名称" autocomplete="off" clearable />
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
      url: 'wechat/official/tags',
      pk: 'tag_id',
      formLabelWidth: '120px',
      formName: 'wechat_tags',
      queryParam: {
        name: ''
      },
      formFieldsData: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { max: 30, message: '最大支持 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sync() {
      this.$http.get('wechat/official/tags/sync').then(res => {
        this.$message.success(res.message)
        this.handleRefresh()
      })
    }
  }
}
</script>

<style scoped>

</style>
