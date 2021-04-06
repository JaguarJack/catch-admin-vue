<template>
  <div>
    <div class="search-container search-form">
      <el-card v-if="search.length > 0" shadow="never">
        <form-create
          :rule="search"
          v-model="searchOptions.fApi"
          :option="searchOptions"
          :value.sync="queryParams"
        />
      </el-card>
    </div>
    <div class="app-container" style="margin: 5px 5px;">
        <div class="filter-container">
          <!-- 表头的 actions -->
          <component
            :is="'el-' + item.el"
            v-for="item in actions"
            :key="item.name"
            :class="item.class"
            :icon="item.icon"
            :type="item.type === undefined ? 'primary' : item.type"
            @click="getTableObject()[item.click]()"
            style="margin-bottom: 5px;"
          >
            {{ item.label }}
          </component>
          <el-button v-if="this.selectedIds.length > 0 && hidePagination" type="danger" size="small" @click="handleDelete(selectedIds)">批量删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="source"
          style="width: 100%"
          v-bind="$attrs"
          :default-sort = "{prop: 'job_name', order: 'descending'}"
          :key="updateKey"
          v-on="getTableEvents"
        >
          <el-table-column
            v-for="(item, k) in headers"
            v-if="item.type !== 'selection'"
            :key="item.name"
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
            <el-button v-if="this.selectedIds.length > 0" style="float: left" type="danger" size="small" @click="handleDelete(selectedIds)">批量删除</el-button>
          </el-col>
          <el-col
            :span="16"
          >
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
    <!-- 页面初始化需要渲染 form-create 目前只能这么做 看看之后有什么更好的方案 -->
    <form-create
     v-show=false
     v-model="formCreate.fApi"
     :rule="formCreate.rule"
     :option="form.options"
     :value.sync="formCreate.value"
    />
  </div>
</template>

<script>
import {isBoolean, isArray} from './type'
import operate from './mixin/operete'
import ElementsMapping from './ElementsMapping'
import ComponentsMapping from './ComponentsMapping'
import create from './mixin/create'
import update from './mixin/update'
import del from './mixin/del'
import view from './mixin/view'
import to from './mixin/to'
import _import from './mixin/import'
import _export from './mixin/export'

export default {
  name: 'Table',
  mixins: [operate, create, update, del, view, to, _import, _export],
  components: {
    ElementsMapping,
    ComponentsMapping
  },
  props: {
    // 获取表格元数据时携带的参数
    filterParams: {
      type: Object,
      default() {
        return {}
      }
    },
    // 默认不清除的搜索参数
    defaultQueryParams: {
      type: Array,
      default() {
        return []
      }
    },
    // api 路由地址
    apiRoute: {
      type: String,
      default() {
        return ''
      }
    },
    // 表格加载 loading
    loading: {
      type: Boolean,
      default: false
    },
    // 弹窗
    dialog: {
      type: Object,
      default() {
        return {
          title: '新增',
          visible: false
        }
      }
    },
    dialogWidth: {
      type: String,
      default() {
        return '50%'
      }
    },
    dialogModal: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 表单数据
    formCreate: {
      type: Object,
      default() {
        return {
          fApi: null,
          value: {},
          rule: []
        }
      }
    },
    // 是否隐藏分页
    hidePagination: {
      type: Boolean,
      default: false
    },
    // 表格头部配置
    headers: {
      type: Array,
      default() {
        return []
      }
    },
    // 搜索列表
    search: {
      type: Array,
      default() {
        return []
      }
    },
    actions: {
      type: Array,
      default() {
        return []
      }
    },
    // element table 原生事件
    tableEvents: {
      type: Object,
      default() {
        return {}
      }
    },
    // 表格事件
    tableActions: {
      type: Array,
      default() {
        return []
      }
    },
    // 树状表格
    tableTree: {
      type: Object,
      default() {
        return null
      }
    },
    selectable: {
      type: Function,
      default() {
        return function() { return true }
      }
    }
  },
  data() {
    return {
      renderTypeList: {
        render: {},
        action: {
          target: 'elements-mapping'
        },
        component: {
          target: 'components-mapping'
        }
      },
      updateKey: 0,
      source: [],
      queryParams: this.filterParams,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sizes: [10, 20, 30, 50]
      },
      // 多选
      selectedIds: [],
      // form data 数据, 为了渲染 Dialog 打开后渲染
      form: {
        // form data
        data: null,
        // form create fill data
        isCreatedFillData: false,
        // form create options
        options: {
          global: {
            upload: {
              props: {
                onSuccess: function(res, file) {
                  file.url = res.data.filePath
                }
              }
            }
          },
          submitBtn: {
            icon: 'el-icon-s-promotion',
            innerText: '确定',
            click: this.handleFormSubmit,
            col: {
              span: 12,
              offset: 2,
            }
          },
          resetBtn: {
            innerText: '取消',
            show: true,
            icon: 'el-icon-switch-button',
            click: this.handleCancel,
            col: {
              span: 12,
              offset: 12
            }
          }
        },
      },
      searchOptions: {
        fApi:{},
        form: {
          inline: true,
          labelWidth: 'auto'
        },
        submitBtn: {
          icon: 'el-icon-search',
          innerText: '搜索',
          click: this.handleSearch,
        },
        resetBtn: {
          innerText: '重置',
          show: true,
          icon: 'el-icon-refresh',
          click: this.handleReset,
        }
      }
    }
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
    getForm() {
      return this.formCreate.fApi
    },
    getTableEvents() {
      let events = this.tableEvents
      for (let key in events) {
        events[key] = this[events[key]]
      }
      return events
    },
  },
  methods: {
    getAttrsValue(item) {
      const { attrs } = { attrs: item }
      const result = {
        ...attrs
      }
      delete result.prop
      return result
    },
    // dialog 打开后渲染表单
    dialogOpened() {
      this.getForm.clearValidateState()
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
        this.getParent.renderAfter()
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
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 2px 5px;
  background: white;
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
