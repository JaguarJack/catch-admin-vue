<template>
    <a-card :bordered="false">
        <we-chat title="CatchAdmin 微信公众号" :menus="this.menus" :width="width" @add='addMenu' @del="delMenu"/>
        <create-menu ref="menuModel" @add="storeMenu"/>
    </a-card>
</template>

<script>
  import WeChat from '@/components/WeChat'
  import CreateMenu from './create'
  export default {
    name: 'index',
    components: { WeChat, CreateMenu },
    data() {
      return {
        menus: [{'name': '+'}],
        default: {'name': '+'},
        width: 12
      }
    },
    created () {
      this.width = 24/this.menus.length
    },
    methods: {
      addMenu(key) {
        this.$refs.menuModel.add(key)
      },
      delMenu(key) {
         if (key.indexOf('/') !== -1) {
           const keys = key.split('/');
           let subMenus = this.menus[keys[0]]
           console.log(subMenus)
           this.menus[keys[0]] = subMenus.filter(function (item, k) {
             return keys[1] !== k
           })
         } else {
           this.menus = this.menus.filter(function (item, k) {
             return key !== k
           })
           this.menus.push(this.default)
           this.menus = this.unique(this.menus)
           this.width = 24 / this.menus.length
         }
      },
      unique(arr) {
        return arr.filter(function(item, index, arr) {
            //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
            return arr.indexOf(item, 0) === index;
        });
      },
      storeMenu(data) {
         data.sub_button = [this.default]
         this.menus.pop()
         this.menus.push(data)
         if (this.menus.length < 3) {
           this.menus.push(this.default)
           this.width = 24/this.menus.length
         }
      }
    }
  }
</script>

<style scoped>

</style>
