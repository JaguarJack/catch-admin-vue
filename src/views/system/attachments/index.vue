<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      <el-button v-if="this.selectedIds.length" size="small" class="filter-item mb-5" type="danger" icon="el-icon-delete" @click="handleMultiDelete">
        批量删除
      </el-button>
    </div>
    <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" border fit @selection-change="handleSelectMulti">
      <el-table-column type="selection" width="55" />
      <el-table-column label="文件名" width="250" prop="filename" />
      <el-table-column prop="url" label="预览" width="150">
        <template slot-scope="attachment">
          <el-image
            v-if="attachment.row.file_ext === 'jpg' || attachment.row.file_ext === 'jpeg' || attachment.row.file_ext === 'png' || attachment.row.file_ext === 'gif'"
            style="width: 100px;"
            :src="attachment.row.url"
            :preview-src-list="[attachment.row.url]">
          </el-image>
          <el-tag v-else class="el-icon-download" @click="download(attachment.row.url)">下载</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" width="330"/>
      <el-table-column prop="file_ext" label="文件后缀" width="100">
        <template slot-scope="attachment">
          <el-tag type="success" @click="queryParam.file_ext=attachment.row.file_ext;handleSearch()">{{ attachment.row.file_ext }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="file_size" label="文件大小" width="100">
        <template slot-scope="attachment">
          <el-tag type="warning">{{ parseInt(attachment.row.file_size/1024) }}KB</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mime_type" label="MimeType" width="100">
        <template slot-scope="attachment">
          <el-tag @click="queryParam.mime_type=attachment.row.mime_type;handleSearch()">{{ attachment.row.mime_type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="driver" label="驱动" width="100">
        <template slot-scope="attachment">
          <el-tag type="danger" @click="queryParam.driver=attachment.row.driver;handleSearch()">{{ attachment.row.driver }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="attachment">
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(attachment.row.id)" />
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
  </div>
</template>

<script>
import formOperate from '@/layout/mixin/formOperate'
export default {
  mixins: [formOperate],
  data() {
    return {
      url: 'attachments',
      queryParam: {
        file_ext: '',
        mime_type: '',
        driver: ''
      },
      selectedIds: []
    }
  },
  methods: {
    download(url) {
      location.href = url
    }
  }
}
</script>

<style scoped>

</style>
