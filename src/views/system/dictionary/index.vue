<!--
 * @Description: 数据字典列表
 * @Author: maryna
 * @Date: 2020-09-15 15:55:21
 * @LastEditTime: 2020-10-22 16:20:16
-->
<template>
  <div v-loading="loading" class="app-container content_box">
    <div class="tab_title_box">
      <div class="filter-container">
        <el-input v-model="queryParam.dict_name" placeholder="类型名称" clearable class="filter-item form-search-input" @clear="handleSearch" />
        <el-button class="filter-item search" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
      </div>
      <div class="tab_title_box_right">
        <el-button size="small" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
        <el-button v-action="'dictionary@save'" size="small" type="primary" icon="el-icon-circle-plus" @click="addDictionary('新增')">新增</el-button>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      border
      fit
      @selection-change="handleSelectMulti"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-loading="loadingItem" :data="props.row.data" style="width: 100%" border align="center" size="mini">
            <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column label="数据值名称" prop="dict_data_name" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column prop="dict_name" label="名称" />
      <el-table-column prop="dict_value" label="值" />
      <el-table-column prop="dict_type" label="类型">
        <template slot-scope="scope">
          {{ scope.row.dict_type ? scope.row.dict_type : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="updated_at" label="更新时间" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip v-action="'dictionary@update'" class="item" effect="dark" content="编辑" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginate.total > 0"
      class="pagination_box"
      background
      :current-page="paginate.current"
      :hide-on-single-page="false"
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-------- 回到顶部 ------------>
    <el-backtop :visibility-height="200" :bottom="100" target=".el_contain .content_box" />
    <!-- ----------------------------------------------添加编辑数据字典-------------------------------------------->
    <el-dialog
      :title="dialogData.title"
      :visible.sync="dialogData.switch"
      width="70%"
      :before-close="handleClose"
      center
      @open="openBox"
    >
      <div class="from_box">
        <el-form ref="ruleForm" v-loading="loadingDialog" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
          <el-form-item label="数据类型名称：" prop="dict_name">
            <el-input v-model.trim="ruleForm.dict_name" placeholder="请输入类型名称" show-word-limit maxlength="30" />
          </el-form-item>
          <el-form-item label="数据类型类型：">
            <el-input v-model.trim="ruleForm.dict_type" placeholder="请输入类型名称" show-word-limit maxlength="30" />
          </el-form-item>
          <el-form-item label="类型值：">
            <div>
              <el-button type="text" @click="AddSpec">+ 添加</el-button><span>可添加类型值，对应生成以下类型值列表</span>
            </div>
            <div>
              <el-table :data="datatable" style="width: 100%" border align="center" size="mini">
                <el-table-column label="序号" align="center" width="55" type="index">
                  <!-- <template slot-scope="scope">
                    <span>{{ scope.row.sort = scope.$index+1 }}</span>
                  </template>
                </el-table-column> -->
                  <el-table-column label="值value" align="center" width="145">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.value" :disabled="scope.row.disable" class="input_width50px" show-word-limit maxlength="5" />
                    </template>
                  </el-table-column>
                  <el-table-column label="排序" align="center" width="145">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.sort" class="input_width50px" show-word-limit maxlength="5" />
                    </template>
                  </el-table-column>
                  <el-table-column label="值名称" align="center">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.name" class="input_width50px" show-word-limit maxlength="30" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="60">
                    <template slot-scope="scope">
                      <el-button type="text" size="mini" @click="delRule(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table-column></el-table>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="text-align: right;">
              <el-button type="primary" :loading="isbtn" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="dialogData.switch=false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formOperate from '@/layout/mixin/formOperate'
import { action } from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'Dictionary',
  directives: { action },
  mixins: [formOperate],
  data() {
    return {
      url: '/dictionary/list/withdata',
      queryParam: {
        dict_name: ''
      },
      loading: false,
      loadingItem: false,
      rules: {
        dict_name: [{
          required: true,
          message: '请输入数据类型名称',
          trigger: 'change'
        }],
        dict_data: [{
          required: true,
          message: '请添加数据类型值',
          trigger: 'change'
        }]
      },
      ruleForm: {
        dict_name: '',
        dict_data: '',
        dict_type: ''
      },
      datatable: [],
      dialogData: {
        switch: false
      },
      isbtn: false,
      loadingDialog: false
    }
  },
  methods: {
    // 属性删除
    delRule(tag) {
      const vm = this
      const data = {
        id: tag.id
      }
      data.variety = tag.dict_value === 1020 ? tag.value : ''
      if (tag.disable) {
        if ((tag.dict_value === 1023 || tag.dict_value === 1020 || tag.dict_value === 1022)) {
          data.value = tag.dict_value !== 1020 ? tag.value : ''
          data.type = tag.dict_value === 1023 ? '2' : tag.dict_value === 1022 ? '1' : ''
        }
        vm.$http.post('/dictionary/del', data).then(response => {
          vm.$message.success('数据字典值删除成功')
          vm.datatable.splice(vm.datatable.indexOf(tag), 1)
          vm.handleRefresh()
        })
      } else {
        vm.datatable.splice(vm.datatable.indexOf(tag), 1)
      }
    },
    // 编辑数据字典
    edit(value) {
      const vm = this
      vm.dialogData.title = '编辑数据类型'
      vm.dialogData.switch = true
      vm.ruleForm.dict_value = value.dict_value
      vm.ruleForm.dict_name = value.dict_name
      vm.ruleForm.dict_type = value.dict_type
      vm.dialogData.id = value.dict_value
      vm.datatable = value.data.map((arr, index) => {
        return {
          name: arr.dict_data_name,
          sort: arr.sort,
          value: arr.dict_data_value,
          disable: true,
          id: arr.id,
          dict_value: arr.dict_value
        }
      })
      vm.ruleForm.dict_data = JSON.stringify(vm.datatable)
    },
    // 添加
    submitForm(formName) {
      const vm = this
      // console.log('vm.datatable', vm.datatable)
      // return false
      vm.ruleForm.dict_data = JSON.stringify(vm.datatable)
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.isbtn = true
          if (vm.dialogData.title === '编辑数据类型') {
            vm._updateDict()
          } else {
            vm._addDict()
          }
        } else {
          return false
        }
      })
    },
    _addDict() {
      const vm = this
      vm.$http.post('/dictionary/add/data', vm.ruleForm).then(response => {
        vm.isbtn = false
        vm.dialogData.switch = false
        vm.handleRefresh()
      }).catch(() => {
        vm.isbtn = false
      })
    },
    _updateDict() {
      const vm = this
      vm.$http.put('/dictionary/update/data' + '/' + vm.dialogData.id, vm.ruleForm).then(response => {
        vm.isbtn = false
        vm.dialogData.switch = false
        vm.handleRefresh()
      }).catch(() => {
        vm.isbtn = false
      })
    },
    addDictionary(title) {
      const vm = this
      vm.dialogData.title = '添加数据类型'
      vm.dialogData.switch = true
    },
    openBox() {
      const vm = this
      if (vm.dialogData.title === '添加数据类型') {
        vm.ruleForm = {
          dict_name: '',
          dict_data: ''
        }
        vm.$refs['ruleForm'].resetFields()
        vm.datatable = []
      }
    },
    handleClose(formName) {
      this.$refs['ruleForm'].resetFields()
      this.dialogData.switch = false
    },
    // 添加商品规格
    AddSpec() {
      const vm = this
      const dataObj = {
        name: '',
        value: Math.floor(Math.random() * 100000),
        sort: '1',
        disable: false
      }
      vm.datatable.push(dataObj)
    }
  }
}
</script>

<style scoped>
.tab_title_box{
  display: flex;
  align-items: center;
  justify-content: space-between
}
</style>
