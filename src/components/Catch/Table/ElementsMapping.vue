<script>
export default {
  props: {
    parent: {
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
    }
  },
  render: function(createElement) {
    return createElement('div',
      this.getCellList.map((cellItem) => {
        const attributes = this.getAttrsValue(cellItem)
        return createElement(
          this.elementsMapping[cellItem.el],
          {
            on: {
              click: cellItem.click.bind(this.parent, this.row)
            },
            domProps: {
              innerHTML: attributes.props.label
            },
            ...attributes
          }
        )
      })
    )
  }
}
</script>
