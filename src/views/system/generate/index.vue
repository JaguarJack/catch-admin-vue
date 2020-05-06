<template>
    <div>
    <a-card :bordered="false">
        <header>
            <h3>代码生成器</h3>
        </header>
        <controller ref="controller" @preview="preview($event)"></controller>
        <model ref="model"></model>
        <a-divider></a-divider>
        <div>
        <a-checkbox  :checked="create.controller" @change="e => createType(e, 'controller')">创建控制器</a-checkbox>
        <a-checkbox  :checked="create.model" @change="e => createType(e, 'model')">创建模型</a-checkbox>
        <a-checkbox  :checked="create.migration" @change="e => createType(e, 'migration')">创建数据迁移</a-checkbox>
        <a-checkbox  :checked="create.table" @change="e => createType(e, 'table')">创建数据表</a-checkbox>
            <a-button style="float: right" @click="submit">提交</a-button>
        </div>
    </a-card>
    <a-drawer width="640" placement="right" :closable="false" @close="() => {this.drawer_visible = false}" :visible="drawer_visible">
        <highlight-code lang="java">
            {{ content }}
        </highlight-code>
    </a-drawer>
    </div>
</template>

<script>
    import controller from './components/controller'
    import model from './components/model'
    import {generate, preview} from '@/api/generate'
    import 'highlight.js/styles/atom-one-dark.css'

    export default {
        components: {
          controller,
          model
        },
        data () {
          return {
            drawer_visible: false,
            content: '',
            create: {
              controller: true,
              model: true,
              migration: true,
              table: true
            }
          }
        },
        methods: {
           createType (e, type) {
             this.create[type] = e.target.checked
           },
           getData () {
             const data = {}
             data.controller = this.$refs.controller.getControllerData()
             data.model = this.$refs.model.getModelData()

             data.create_controller = this.create.controller
             data.create_model = this.create.model
             data.create_migration = this.create.migration
             data.create_table = this.create.table
             return data
           },
           submit () {
             generate({'data': JSON.stringify(this.getData())}).then(res => {
                this.toast(res)
             })
          },
          preview (type) {
             const data = this.getData()
             this.drawer_visible = false
             data.type = type
             preview({'data': JSON.stringify(data)}).then(res => {
                this.content = res.data
                this.drawer_visible = true
             })
          },
        }
    }
</script>
