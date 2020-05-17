<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.username }}<span class="welcome-text">，{{ welcome }}</span></div>
      <div>欢迎使用 CatchAdmin 后台管理</div>
    </div>
    <div slot="extra">
      <a-row class="more-info">
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            style="margin-bottom: 24px;"
            :bordered="false"
            title="介绍"
            :body-style="{ padding: 0 }">
            <div>
              <p align="center">
                <img src="https://cdn.learnku.com/uploads/images/202005/17/18206/zSuf7Ce5kM.png!large">
              </p>
              <p align="center"><code>CatchAdmin</code>是一款基于<a href="http://www.thinkphp.cn/" target="_blank">thinkphp framework</a>和
                <a href="https://pro.loacg.com/docs/getting-started">ant degisn pro vue</a>二次开发而成的后台管理系统，采用了目前趋势的前后端分离开发模式，后端仅需要提供简洁的 API 数据结构，前端负责呈现数据。目前前端采用数据驱动，大大提高了开发效率。这不仅仅是一个项目，更是后端更新技术栈的一次实践</p>
              <p align="center">
                <a href="http://doc.catchadmin.com/">文档</a> |
                <a href="http://vue.catchadmin.com">演示地址</a> |
                <a href="http://apidoc.catchadmin.com">接口文档</a> |
                <a href="https://gitee.com/jaguarjack/catchAdmin">项目源码</a> |
                <a href="https://www.kancloud.cn/akasishikelu/thinkphp6">看云分析</a> |
                <a href="#extensions">扩展</a>
              </p>
            </div>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="项目" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a href="https://gitee.com/jaguarjack/catchAdmin" target="_blank">
                <img src="https://svg.hamm.cn/gitee.svg?type=star&user=jaguarjack&project=catchAdmin"/>
              </a >
              <a href="https://gitee.com/jaguarjack/catchAdmin" target="_blank">
                <img src="https://svg.hamm.cn/gitee.svg?type=fork&user=jaguarjack&project=catchAdmin"/>
              </a >
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=Base&value=ThinkPHP6"/>
              </a>
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=Data&value=MySQL5.5"/>
              </a>
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=Runtime&value=PHP7.1"/>
              </a>
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=License&value=Apache-2.0"/>
              </a>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'

import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { Radar } from '@/components'
import { getRoleList } from '@/api/manage'

export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    Radar
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},

      projects: [],
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],
      svg: 'https://img.shields.io/github/stars/yanwenwu/catch-admin.svg',
      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [{
        dataKey: 'score',
        min: 0,
        max: 80
      }],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      radarData: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar

    getRoleList().then(res => {
      // console.log('workplace -> call getRoleList()', res)
    })
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
