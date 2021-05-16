<script>
import {isFunction} from "@/components/Catch/Table/type";

export default {
  props: {
    parent: {
      type: Object,
      default() {
        return {}
      }
    },
    catchTable: {
      type: Object,
      default() {
        return {}
      }
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    cellList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      elementsMapping: {
        button: 'el-button'
      }
    }
  },
  computed: {
    getCellList() {
      return this.cellList.filter((cell) => cell && Object.keys(cell).length)
    }
  },
  created() {
    this.$options.components = this.parent.$options.components
    this.$options.directives = this.parent.$options.directives
  },
  methods: {
    getAttrsValue(item) {
      const {
        class: className,
        style,
        directives,
        ...attrs
      } = item
      return {
        class: className,
        style,
        directives: directives || [],
        props: attrs
      }
    },
    getOnFunctions(cellItem) {
      let on = {};

      if (cellItem.click !== undefined) {
        if (isFunction(cellItem.click)) {
          // 支持方法
          on.click = cellItem.click.bind(this.parent, this.row)
        } else {
          // 绑定方法
          if (this.catchTable[cellItem.click] === undefined) {
            on.click = this.catchTable.$parent[cellItem.click].bind(this.parent, this.row)
          } else {
            on.click = this.catchTable[cellItem.click].bind(this.parent, this.row)
          }
        }
      }

      // 支持路由跳转
      if (cellItem.route !== undefined) {
        on.click = this.catchTable.to.bind(this.parent, this.row, cellItem.route)
      }

      return on
    }
  },
  render: function(createElement) {
    return createElement('div',
      this.getCellList.map((cellItem) => {
        const attributes = this.getAttrsValue(cellItem)
        let label = attributes.props.label
        if (attributes.props.icon !== undefined) {
          label = label === undefined ? '<icon class="' + attributes.props.icon + '">' : '<icon class="' + attributes.props.icon + '"> ' + label
        }

        // 绑定指令
        attributes.directives.push({
          name: 'action',
          value: cellItem.permission
        })

        return createElement(
          this.elementsMapping[cellItem.el],
          {
            on: this.getOnFunctions(cellItem),
            domProps: {
              innerHTML: label
            },
            ...attributes
          }
        )
      })
    )
  }
}
</script>
