<template>
  <div>
      <el-button type="primary" @click="toField">字段列表</el-button>
      <el-button type="success" @click="toRelate">字段使用</el-button>
      <el-dialog
        title="字段列表"
        :visible.sync="fieldVisible"
        width="75%"
        @close="handleClosed"
        append-to-body
      >
        <fields :model_id="$attrs.row.id" v-if="fieldVisible"/>
      </el-dialog>
      <el-dialog
        title="字段使用"
        :visible.sync="usedVisible"
        width="40%"
        @close="handleClosed"
        append-to-body
      >
        <used-at :model_id="$attrs.row.id" v-if="usedVisible" @closeUsedAt="handleClosed"/>
      </el-dialog>
  </div>

</template>

<script>
import fields from '@/views/cms/model/fields'
import usedAt from '@/views/cms/model/usedAt'

export default {
  name: 'operate',
  components: {fields, usedAt},
  data() {
    return {
      fieldVisible: false,
      usedVisible: false,
    }
  },
  methods: {
    toField() {
      /**this.$router.push({
        path: `/cms/model/fields/${this.$attrs.row.id}`
      });*/
      this.fieldVisible = true;
    },
    toRelate() {
      this.usedVisible = true;
    },
    handleClosed() {
      this.fieldVisible = false
      this.usedVisible = false
    }
  }
}
</script>
