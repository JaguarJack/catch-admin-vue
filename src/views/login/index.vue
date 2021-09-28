<template>
  <div class="login" style="background-color: #e9ecef;height: 100%;  overflow-y:hidden;">
    <el-card shadow="always" class="login-card">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <div class="title-container">
          <h3 class="title" style="text-align: center">CatchAdmin 后台管理系统</h3>
        </div>
        <h2>登 录</h2>
        <el-divider/>
        <el-form-item prop="email">
          <span class="svg-container" style="font-size: 16px;">
            邮 箱
          </span>
          <el-input
            ref="email"
            v-model="loginForm.email"
            prefix-icon="el-icon-user"
            placeholder="请输入邮箱"
            name="email"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container" style="font-size: 16px;">
              密 码
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              show-password
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin"><i class="el-icon-s-promotion"/> 登 录</el-button>
        <el-divider></el-divider>
        <div style="color: darkgrey; font-size: 14px;text-align: center;height: 50px;line-height: 50px;">
          <a href="https://catchadmin.com/">CatchAdmin 管理系统</a> @copyright 2018-2020
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        email: 'catch@admin.com',
        password: 'catchadmin'
      },
      loginRules: {
        email: [{ required: true, type: 'email', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.email === '') {
      this.$refs.email.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
  .login .el-input .el-input__inner {
    padding-left: 35px;
    height: 40px;
    font-size: 16px;
  }

  .login .el-card {
    border-radius: 5%;
  }
  @media screen and (max-device-width: 1920px) {
    .login .el-card {
      width: 28%;
      margin: 10% auto;
      height: 65%;
      padding: 40px 10px;
    }
    .login .el-card .el-button{
      position: relative;
      left: 80%;
    }
  }
  @media screen and (max-device-width: 600px) {
   .login .el-card {
      width: 100%;
      height: 100%;
      margin: auto;
     padding-top: 25%;
    }
    .login .el-card .el-button{
      position: relative;
      // left: 35%;
    }
  }
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px inset !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      color: #DCDFE6;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
