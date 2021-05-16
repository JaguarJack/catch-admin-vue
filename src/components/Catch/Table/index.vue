<template>
  <div>
    <search
      :search="search"
      @handleSearch="this.handleSearch"
      @handleReset="this.handleReset"
      ref="search"
    />

    <div class="app-container" style="margin: 3px 5px;">
      <el-alert
        v-if="tips"
        :title="tips.content"
        :type="tips.type"
        style="margin-bottom: 5px;"
      />
        <div class="filter-container">
          <!-- 表头的 actions -->
          <component
            :is="'el-' + item.el"
            v-for="item in actions"
            :key="item.name"
            :class="item.class"
            :icon="item.icon"
            v-action="item.permission"
            :type="item.type === undefined ? 'primary' : item.type"
            @click="actionClick(item.click)"
            style="margin-bottom: 5px;"
          >
            {{ item.label }}
          </component>
          <el-button v-if="this.selectedIds.length > 0 && hidePagination" type="danger" size="small" @click="handleDelete(selectedIds)">批量删除</el-button>

          <div class="fr">
            <el-button icon="el-icon-refresh"  @click="refreshPage" class="mr-5" size="mini"/>
            <el-dropdown :hide-on-click="false">
              <span class="el-dropdown-link">
                 <el-button icon="el-icon-menu" size="mini"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, k) in headers"
                  :key="item.prop"
                  v-if="item.label.length > 0"
                >
                  <el-checkbox v-model="item.show">{{  item.label }}</el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="source"
          style="width: 100%"
          v-bind="$attrs"
          :key="updateKey"
          v-on="getTableEvents"
        >
          <el-table-column
            v-for="(item, k) in getHeaders"
            v-if="item.type !== 'selection'"
            :key="item.prop"
            v-bind="getAttrsValue(item)"
          >
            <template v-slot="scope">
              <div v-if="isActionOrComponent(getValue(scope, item))">
                <component
                  :is="renderTypeList[getMatchRenderFunction(item)].target"
                  :cell-list="getValue(scope, item)"
                  :row="scope.row"
                  :parent="getParent"
                  :catch-table="getTableObject()"
                  @click.native="($event) => {
                    handleNativeClick(getAttrsValue(item), $event)
                  }"
                />
              </div>
              <span v-else>
                {{ getValue(scope, item) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            type="selection"
            width="50px"
            :selectable="selectable"
          />
        </el-table>

        <el-row
          v-if="!hidePagination"
          justify="end"
          type="flex"
        >
          <el-col :span="8" style="padding-top: 14px">
            <el-button v-if="this.selectedIds.length > 0" icon="el-icon-delete" style="float: left" type="danger" size="small" @click="handleDelete(selectedIds)">批量删除</el-button>
          </el-col>
          <el-col :span="16">
            <el-pagination
              class="pagination-container"
              background
              layout="total, sizes, prev, pager, next"
              :current-page="pagination.currentPage"
              :page-size="pagination.pageSize"
              :page-sizes="pagination.sizes"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </el-col>
        </el-row>

      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        :width="dialogWidth"
        :modal="dialogModal"
        @opened="dialogOpened"
        @close="handleHiddenDialog"
        :show-header="false"
        class="catch-form"
        append-to-body
      >
        <form-create
          v-model="formCreate.fApi"
          :rule="formCreate.rule"
          :option="form.options"
          :value.sync="formCreate.value"
        />
      </el-dialog>
      </div>

    <form-create
      v-show="false"
      v-model="formCreate.fApi"
      :rule="[]"
    />
    <!--- 导入  -->
    <import-excel ref="import"/>
  </div>
</template>

<script>
import {isBoolean, isArray} from './type'
import operate from './mixin/operete'

// components
import ElementsMapping from './components/ElementsMapping'
import ComponentsMapping from './components/ComponentsMapping'
import search from './components/search'
import importExcel from './components/import'
// mixins
import create from './mixin/create'
import update from './mixin/update'
import del from './mixin/del'
import view from './mixin/view'
import to from './mixin/to'
import _export from './mixin/export'
import excel from './mixin/excel'
import props from './mixin/props'
import tableData from './mixin/tableData'


export default {
  name: 'Table',
  mixins: [operate, create, update, del, view, to, _export, excel, props, tableData],
  components: {
    ElementsMapping,
    ComponentsMapping,
    search,
    importExcel
  },
  computed: {
    // 获取可用 refs 为止
    getParent() {
      let parent = this.$parent

      while (!Object.keys(parent.$refs).length) {
        parent = parent.$parent
      }

      return parent
    },
    // 搜索参数
    queryParams() {
      console.log(this.$refs.search)
      return this.$refs.search.queryParams
    },
    getTableEvents() {
      let events = this.tableEvents
      for (let key in events) {
        events[key] = this[events[key]]
      }
      return events
    },
    getForm() {
      return this.formCreate.fApi
    },

    // headers
    getHeaders() {
      return this.headers.filter(header=> header.show);
    }
  },
  methods: {
    getAttrsValue(item) {
      const { attrs } = { attrs: item }
      return  {
        ...attrs
      }
      // delete result.prop
     // return result
    },
    dialogOpened() {
      this.getForm.clearValidateState()
      // 表单渲染后的操作
      this.dialogOpenedFirstDo()

      this.getForm.refresh()
      // 创建时候填充数据
      if (this.form.isCreatedFillData) {
        this.getForm.setValue(this.form.data)
      }
      // 创建时
      if (this.form.data === null) {
        this.getForm.resetFields()
      } else {
        // 更新时
        this.getForm.setValue(this.form.data)
      }
      // 渲染完成之后钩子
      if (this.getParent.renderAfter !== undefined) {
        this.getParent.renderAfter(this.form.data)
      }
    },
    dialogOpenedFirstDo() {
        // 创建前操作
        if (this.getParent.beforeCreate !== undefined) {
            this.getParent.beforeCreate()
        }

        // 更新前数据操作
        if (this.form.data && this.getParent.beforeUpdate !== undefined) {
          this.getParent.beforeUpdate(this.form.data)
        }
    },
    getValue(scope, configItem) {
      const prop = configItem.prop
      const renderName = this.getMatchRenderFunction(configItem)
      const renderObj = this.renderTypeList[renderName]
      if (renderObj !== undefined) {
        return configItem[renderName]
        /** return renderObj.target
          ? this.getRenderValue(scope, configItem, { name: renderName, type: 'bind' })
          : this.getRenderValue(scope, configItem)*/
      }
      return scope.row[prop]
    },
    getRenderValue(scope, item, fn = { name: 'render', type: 'call' }) {
      const prop = item.prop
      const propValue = prop && scope.row[prop]
      // this.$set(scope.row, '$index', scope.$index)
      const args = propValue !== undefined ? propValue : scope.row
      return item[fn.name][fn.type](this.getParent, args)
    },
    // 匹配 render 开头的函数
    getMatchRenderFunction(obj) {
      return Object.keys(obj).find((key) => {
        if (key === 'action' || key === 'component') {
          return key
        }
      })
    },
    isActionOrComponent($item) {
      return isArray($item)
    },
    stopBubbles(e) {
      const event = e || window.event
      if (event && event.stopPropagation) {
        event.stopPropagation()
      } else {
        event.cancelBubble = true
      }
    },
    handleNativeClick({ isBubble }, e) {
      // 考虑到单元格内渲染了组件，并且组件自身可能含有点击事件，故添加了阻止冒泡机制
      // 若指定 isBubble 为 false，则当前单元格恢复冒泡机制
      if (
        isBoolean(isBubble) &&
        !isBubble
      ) return
      this.stopBubbles(e)
    },
    // 获取 table 对象
    getTableObject() {
      return this
    },
    refreshPage() {
      this.getParent.getTableFrom()
    },
    // 表头按钮事件触发
    actionClick(clickEvent) {
      if (this[clickEvent] === undefined) {
        this.getParent[clickEvent]()
      } else {
        this[clickEvent]()
      }
    },
    handleImport() {
      this.$refs.import.handleImport()
    }
  }
}
</script>

<style lang="scss">
.search-container {
  margin: 2px 5px;
  background: white;
}
._import_ {
  .el-dialog__body {
    padding: 5px 20px 60px 20px;
  }
  .el-divider {
    margin: 8px 0;
  }
}
.search-form {
  // padding-bottom: 20px;
  text-align: right;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-top: 3px;
  }
  .form-search-input {
    width: 200px;
    margin-right: 5px;
  }

  .reset,.search,.multi-delete{
    padding-left: 10px;
    padding-right: 10px;
  }
}
.table-list-container {
  .table-pagination {
    padding-top: 20px;
  }
  .header {
    display: flex;
    padding-bottom: 20px;
    .header-actions {
      flex: 1;
      overflow-x: auto;
      .overflow-box {
        display: flex;
        flex-direction: row-reverse;
        overflow-x: auto;
        white-space: nowrap;
        .el-button:nth-child(1) {
          margin-left: 10px;
        }
      }
    }
  }
  .el-table {
    th {
      font-size: 14px;
    }
    td {
      font-size: 14px;
    }
  }
}
</style>
