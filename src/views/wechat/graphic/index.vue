<template>
    <page-view>
        <a-card class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="4" :sm="24">
                        <a-input allowClear  placeholder="请输入标题名称" v-model="title"/>
                    </a-col>
                    <a-col :md="4" :sm="24">
                        <span class="table-page-search-submitButtons">
                        <a-button icon="search" type="primary" @click="refresh">查询</a-button>
                        <a-button icon="plus" style="margin-left: 8px" @click="add">新增</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
        <a-card style="margin-top: 5px;">
        <a-list
            rowKey="id"
            :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
            :dataSource="dataSource"
        >
            <a-list-item slot="renderItem" slot-scope="item">
                    <a-card :hoverable="true">
                        <img slot="cover" :src="item.cover"/>
                        <a-card-meta>
                            <a slot="title">{{ item.title }}</a>
                        </a-card-meta>
                        <template class="ant-card-actions" slot="actions">
                            <a-icon key="edit" type="edit" @click="edit(item.id)"/>
                            <a-icon key="delete" type="delete" @click="del(item.id)"/>
                        </template>
                    </a-card>
            </a-list-item>
        </a-list>
        <create-graphic ref="createGraphicModel" @refresh="refresh"/>
        <a-pagination
            show-size-changer
            :default-current="paginate.page"
            :total="paginate.total"
            @change="onChangePage"
            @showSizeChange="onShowSizeChange"
            style="float: right"
        />
        </a-card>
    </page-view>
</template>

<script>
  import PageView from '@/layouts/PageView'
  import CreateGraphic from './create'

  export default {
    name: 'index',
    components: { PageView, CreateGraphic},
    data() {
      return {
        paginate: {
          total: 100,
          pageSize: 10,
          page:1
        },
        articles: [],
        dataSource: [],
        title: '',
      }
    },
    created () {
      this.$http.get('wechat/official/graphic').then(res => {
            this.paginate.total = res.count
            this.paginate.pageSize = res.limit
            this.paginate.page = res.current
            this.dataSource = res.data
      })
    },
    methods: {
      add() {
        this.$refs.createGraphicModel.add()
      },
      edit(id) {
        this.$refs.createGraphicModel.edit(id)
      },
      del(id) {
        this.$confirm({
          title: '确定删除改图文吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.$http.delete('wechat/official/graphic/' + id).then(res => {
              this.refresh()
            })
          },
        })
      },
      onChangePage(page, pageSize) {
        this.paginate.page = this.page
        this.paginate.pageSize = pageSize
        this.refresh()
      },
      refresh() {
        this.$http.get('wechat/official/graphic', {page: this.paginate.page, limit: this.paginate.pageSize, title:this.title}).then(res => {
          this.dataSource = res.data
        })
      },
      onShowSizeChange(current, size) {
        this.paginate.pageSize = size
      }
    }
  }
</script>

<style scoped>

</style>
