<template>
  <div class="dashboard-editor-container">
    <!--<panel-group @handleSetLineChartData="handleSetLineChartData" />-->
    <el-row :gutter="12">
      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>项目介绍</span>
          </div>
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
            <div align="center">
              <a href="https://gitee.com/jaguarjack/catchAdmin" target="_blank">
                <img src="https://svg.hamm.cn/gitee.svg?type=star&user=jaguarjack&project=catchAdmin" />
              </a >
              <a href="https://gitee.com/jaguarjack/catchAdmin" target="_blank">
                <img src="https://svg.hamm.cn/gitee.svg?type=fork&user=jaguarjack&project=catchAdmin" style="margin-left: 10px;"/>
              </a >
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=Base&value=ThinkPHP6" style="margin-left: 10px;"/>
              </a>
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=Data&value=MySQL5.5" style="margin-left: 10px;"/>
              </a>
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=Runtime&value=PHP7.1" style="margin-left: 10px;"/>
              </a>
              <a>
                <img src="https://svg.hamm.cn/badge.svg?key=License&value=Apache-2.0" style="margin-left: 10px;"/>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>☕️ Buy me a coffee</span>
          </div>
            <el-alert
              title="如果觉得项目对你有帮助，或者帮你节省了开发时间，可以通过以下方式 [wechat]/[alipay] 赞助开发者。开源不易，感谢支持🙏"
              type="success"
              :closable="false" />
            <el-divider/>
            <div class="block">
              <el-image src="https://cdn.learnku.com/uploads/images/202008/11/18206/e6qAAM8Bod.jpg!large"></el-image>
            </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>云大使推广 通过以下链接购买云产品可以获的折扣</span>
      </div>
      <el-link href="https://www.aliyun.com/product/ecs?source=5176.11533457&userCode=oq2t54oi&type=copy" target="_blank" type="success">🎉 通过链接购买阿里云[ECS]，可获得低折优惠 👉</el-link>
      <el-divider></el-divider>
      <el-link href="https://www.aliyun.com/product/oss?source=5176.11533457&userCode=oq2t54oi" target="_blank" type="warning">🎉 通过链接购买阿里[OSS]云存储服务，可获得低折优惠 👉</el-link>
      <el-divider></el-divider>
      <el-link href="https://curl.qcloud.com/fQDTtPNl" target="_blank" type="primary">🎉 【腾讯云】新客户无门槛领取总价值高达2860元代金券，每种代金券限量500张，先到先得。 👉</el-link>
      <el-divider></el-divider>
      <el-link href="https://curl.qcloud.com/sNfg5CJy" target="_blank" type="danger">🎉 【腾讯云】热卖云产品3折起，云服务器、云数据库特惠，服务更稳，速度更快，价格更优 👉</el-link>
      <el-divider></el-divider>
    </el-card>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
