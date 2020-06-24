<template>
    <div>
        <div class="wechat" :autoInsertSpaceInButton="false">
            <div class="mobile_header">
                <a-row>
                    <a-col :span="12">
                        <a-row>
                            <a-col :span="12">
                                <a-icon type="ellipsis"/>
                                <a-icon type="ellipsis" />&nbsp;&nbsp;&nbsp;
                                <span class="word">China Mobile</span>
                            </a-col>
                            <a-col :span="12">
                                <a-icon type="wifi"/>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="12">
                        <div> {{ current() }}</div>
                    </a-col>
                </a-row>
            </div>
            <div class="header">
                <div class="word"> {{ title }}</div>
            </div>
            <div class="body">
                <div style="float: left"><</div>
                <div style="margin: 0 auto;">微信公众号</div>
            </div>
            <div class="footer">
                <a-row>
                    <a-col :span="4">
                        <div style="border-right: 1px solid #666;">asdasasd</div>
                    </a-col>
                    <a-col :span="20">
                        <a-row>
                            <a-col :span="width" v-for="(item, key) in this.menus">
                                <div v-if="item && item.name === '+'" @click="add">{{ item.name }}</div>
                                <a-popover trigger="click" v-else>
                                    <template slot="content">
                                        <div v-for="(v, k) in item.sub_button" class="sub_button">
                                            <div class="absolute2" @click="del(k+'/'+key)">
                                                <a-icon type="close-square" />
                                            </div>
                                            <span v-if="v && v.name === '+'" @click="add(key)">{{ v.name }}</span>
                                            <span v-else>{{ v.name }}</span>
                                        </div>
                                    </template>
                                    <div >
                                        <div class="absolute" @click="del(key)">
                                            <a-icon type="close-square" />
                                        </div>
                                        {{ item.name }}
                                    </div>
                                </a-popover>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'WeChat',
    props: ['title', 'menus', 'width'],
    data() {
      return {
      };
    },
    methods: {
      add(key) {
        this.$emit('add', key)
      },
      del(key) {
        this.$emit('del', key)
      },
      current () {
        const date = new Date
        return date.getHours() + ' : ' + date.getMinutes()
      }
    }
  }
</script>

<style lang="css" scoped>
    .wechat {
        margin: 0 auto;
        border: 1px solid #666;
        height: 100%;
    }
    .wechat .mobile_header {
        width: 100%;
        background-color: #333333;
        color: white;
        height: 30px;
        line-height: 30px;
    }
    .wechat .header {
        width: 100%;
        height: 20%;
        display: table;
    }
    .wechat .header .word {
        vertical-align: middle;
        display: table-cell;
        text-align: center;
    }
    .wechat .body {
        height: 300px;
        background-color: #F8F8F8;
    }
    .wechat .footer {
        width: 100%;
        height: 40px;
        line-height: 40px;
    }
    .wechat .footer div {
        text-align: center;
        height: 100%;
        margin: 0 auto;
    }
    .wechat .footer .ant-btn {
        border-radius: 0;
        width: 100%;
        height: 100%;
    }
    .wechat .absolute {
        width: 15px;
        height: 15px;
        position: absolute;
        text-align: center;
        line-height: 15px;
        right: 0;
        top: 0;
        display: inline-block;
    }
    .absolute2 {
        width: 15px;
        height: 15px;
        line-height: 15px;
        display: inline-block;
        float: right;
    }

    .sub_button {
        border-top:1px solid #999;
        width: 100px;
        height:50px;
        text-align: center;
        line-height: 50px
    }

    .sub_button:first-child {
        border-top: 0;
    }
    @media screen and (max-width: 450px) {
        body{
            min-width: 450px;
        }
        .wechat {
            width: 95%;
        }
        .wechat .word {
            font-size: 0.3rem;
        }
    }
    @media screen and (min-width: 800px) {
        body{
            max-width: 800px;
        }
        .wechat {
            width: 38%;
        }
    }
</style>
