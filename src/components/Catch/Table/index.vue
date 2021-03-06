<template>
  <div class="app-container">
    <component is="div">
      <div class="filter-container">
        <component
          v-for="(item, k) in search"
          :is="'el-' + item.type"
          class="filter-item form-search-input"
          v-model="queryParams[item.name]"
          :placeholder="item.placeholder"
          clearable
          :key="item.name"
          type="datetime"
        >
          <component
            v-if="item.type === 'select'"
            is="el-option"
            v-for="(i, k) in item.options"
            :value="i.value"
            :label="i.text"
            :key="i.value"
          />
        </component>
        <!-- 搜索按钮  --->
        <el-button v-if="search.length > 0" class="filter-item search" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button v-if="search.length > 0" class="filter-item" icon="el-icon-refresh" @click="handleReset">刷新</el-button>
        <!-- 额外的 action -->
        <component
          is="el-button"
          v-for="(item, k) in actions"
          :class="item.class"
          :icon="item.icon"
          :key="item.name"
          @click="item.action"
          :type="item.type === undefined ? 'primary' : item.type"
        >
          {{ item.text }}
        </component>
      </div>
      <el-table
        v-loading="loading"
        :data="source"
        style="width: 100%"
        v-bind="$attrs"
        v-on="tableEvents"
      >
        <el-table-column
          v-for="(item, k) in headers"
          :key="item.name"
          v-if="item.type !== 'selection'"
          v-bind="getAttrsValue(item)"
        >
          <template v-slot="scope">
            <elements-mapping
              v-if="headers.length - 1 === k"
              :cell-list="defaultActions(scope.row)"
              :row="scope.row"
              :parent="getParent"
              @click.native="($event) => {
                handleNativeClick(getAttrsValue(item), $event)
              }"
            />
            <div v-if="isFunction(getValue(scope, item))">
              <component
                :is="renderTypeList[getMatchRenderFunction(item)].target"
                :cell-list="getValue(scope, item)()"
                :row="scope.row"
                :parent="getParent"
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
        />
      </el-table>

      <el-row
        justify="end"
        type="flex"
      >
        <el-col :span="8" style="padding-top: 14px">
          <el-button  type="danger" size="small" v-if="this.selectedIds.length > 0" @click="handleDelete(selectedIds)">批量删除</el-button>
        </el-col>
        <el-col
          :span="16"
          v-if="!hidePagination"
        >
          <el-pagination
            class="pagination-container"
            background
            layout="prev, pager, next"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.sizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </el-col>
      </el-row>
    </component>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :width="dialogWidth"
      :modal="dialogModal"
      @opened="dialogOpened"
    >
      <form-create v-model="formCreate.fApi" :rule="formCreate.rule" :option="form.options" :value.sync="formCreate.value"/>
    </el-dialog>
  </div>
</template>

<script>
import { isFunction, isBoolean } from './type'
import operate from './mixin/operete'
import ElementsMapping from './ElementsMapping'
import ComponentsMapping from './ComponentsMapping'
import formCreate from '@form-create/element-ui'

export default {
  name: 'Table',
  mixins: [operate],
  components: {
    ElementsMapping,
    ComponentsMapping,
    'form-create': formCreate.component('form-create')
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
        /**
        return {
          fApi: {},
          value: {},
          rule: {},
        }*/
        return {
          fApi: null,
          value: {},
          rule: {},
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
    // 禁用表格事件
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
    }
  },
  data() {
    return {
      renderTypeList: {
        render: {},
        renderHTML: {
          target: 'elements-mapping'
        },
        renderComponent: {
          target: 'components-mapping'
        }
      },
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
                onSuccess: function(res, file){
                  file.url = res.data.filePath
                }
              }
            }
          },
          submitBtn: {
            col: {
              span: 3,
              push: 21,
            },
            icon: '',
            innerText: '确定',
            click: this.handleFormSubmit
          },
          resetBtn: {
            width: '95%',
            col: {
              span: 3,
              push: 15,
            },
            innerText: '取消',
            show: true,
            icon: '',
            click: this.handleCancel
          }
        }
      },
    }
  },
  computed: {
    getParent() {
      return this.$parent
    },
    getForm() {
      return this.formCreate.fApi
    }
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
    },
    getValue(scope, configItem) {
      const prop = configItem.prop
      const renderName = this.getMatchRenderFunction(configItem)
      const renderObj = this.renderTypeList[renderName]
      if (renderObj && this.isFunction(configItem[renderName])) {
        return renderObj.target
          ? this.getRenderValue(scope, configItem, { name: renderName, type: 'bind' })
          : this.getRenderValue(scope, configItem)
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
        const matchRender = key.match(/^render.*/)
        return matchRender && matchRender[0]
      })
    },
    isFunction(fn) {
      return isFunction(fn)
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
    // 默认的 actions
    defaultActions(row) {
      const size = 'mini'
      const el = 'button'

     let actions = [];

      const add = {
        size: size, el: el, type: 'primary', icon: 'el-icon-plus',
        click() {
          if (this.beforeCreate !== undefined) {
            const p = this.beforeCreate(row)

            if (p instanceof Promise) {
              p.then(() => {
                this.$refs[this.table.ref].handleShowDialog(row)
              })

              return false
            }
          }

          this.$refs[this.table.ref].handleShowDialog()
        }
      }

      const edit = {
        size: size, el: el, type: 'primary', icon: 'el-icon-edit',
        click() {
          if (this.beforeUpdate !== undefined) {
            const p = this.beforeUpdate(row)

            if (p instanceof Promise) {
                p.then(() => {
                  this.$refs[this.table.ref].handleShowDialog(row)
                })

                return false
              }
          }

          this.$refs[this.table.ref].handleShowDialog(row)
        }
      }

      const del = {
        size: size, el: el, type: 'danger', icon: 'el-icon-delete',
        click() {
          if (this.beforeDelete !== undefined) {
            this.beforeDelete(row);
          }
          this.$refs[this.table.ref].handleDelete(row.id)
        }
      }

      const view = {
        size: size, el: el, type: 'success', icon: 'el-icon-view',
        click() {
          if (this.beforeView !== undefined) {
            this.beforeView(row);
          }
          this.$refs[this.table.ref].handleView(row)
        }
      }

      this.tableActions.forEach(function(item){
          if (item === 'add') {
              actions = actions.concat(add)
          }

          if (item === 'edit') {
            actions = actions.concat(edit)
          }

          if (item === 'delete') {
            actions =  actions.concat(del)
          }

          if (item === 'view') {
            actions =  actions.concat(view)
          }
      })

      return actions
    }
  }
}
</script>

<style lang="scss" scoped>
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
