<template>
  <el-dialog
    title="导入"
    :visible.sync="importVisible"
    width="30%"
    class="_import_"
  >
    <el-alert
      title="请按照模版要求填写对应数据"
      type="warning"/>
    <el-divider/>
    <el-button size="small" type="danger" @click="exportExcelTemplate" class="fr">下载导出模版</el-button>

    <div style="color: #909399"> <i class="el-icon-warning-outline"/> 请按照模板样式填写</div>
    <div style="color: #909399"> <i class="el-icon-warning-outline"/> 请勿出现整行为空、单元格为空的情形</div>
    <div style="color: #909399"> <i class="el-icon-warning-outline"/> 为确保您的订单数据导入正常，建议下载新的模板导入</div>
    <el-divider/>
    <el-upload
      ref="importUpload"
      :action="importAction"
      :show-file-list="true"
      :multiple="false"
      :limit="1"
      :data="extraImport"
      :file-list="importList"
      :headers="importHeaders"
      :auto-upload="false"
      :on-success="importSuccess"
      v-loading="importLoading"
    >
      <div>
        <el-button slot="trigger" size="small" type="primary" >选取导入文件</el-button>
      </div>
    </el-upload>
    <el-button size="small" type="success" class="fr" @click="handleSubmitImport">导入</el-button>
  </el-dialog>
</template>

<script>
import _import from '../mixin/import'
import excel from '@/components/Catch/Table/mixin/excel'

export default {
  name: 'importExcel',
  mixins: [_import, excel],
  computed: {
    getParent() {
      return this.$parent.getParent
    }
  }
}
</script>

<style scoped>

</style>
