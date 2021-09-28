export default {
  props: {
    tips: {
      type: Object,
      default() {
        return null
      }
    },
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
  }
}
