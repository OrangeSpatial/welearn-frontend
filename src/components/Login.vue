<template>
    <div class="login_container">
        <el-row :gutter="10">
          <el-col class="m-col" :xs="0" :sm="16" :md="10" :lg="10" :xl="10">
            <!-- 图 -->
            <img class="showImage" src="../assets/img/show.png"/>
          </el-col>
          <el-col :xs="24" :sm="8" :md="14" :lg="14" :xl="14" class="m-col">
            <el-card class="login_box" shadow="hover">
              <!-- 输入框 -->
              <img src="../assets/img/DL_logo.png" alt="logo" class="logo">
              <div class="welcome">欢迎登录</div>
              <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="login_rules">
                  <el-form-item prop="username">
                    <el-input suffix-icon="iconfont icon-user" placeholder="输入用户名" v-model="loginForm.username"/>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input suffix-icon="iconfont icon-icon-test15" type="password" placeholder="输入密码"
                              v-model="loginForm.password"/>
                  </el-form-item>
<!--                  <el-form-item prop="rememberMe">-->
<!--                    <el-radio v-model="loginForm.rememberMe" label="rememberMe">记住我</el-radio>-->
<!--                  </el-form-item>-->
              </el-form>
              <!-- 按钮 -->
              <el-row class="loginbtn">
                  <el-button @click="validateLoginForm()" type="primary">登录</el-button>
              </el-row>
              <el-divider/>
              <div class="registerBox">
                <a href="">忘记密码？</a>
                <router-link to="/start/register">免费注册</router-link>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import { login } from '../api/user'

export default {
  data () {
    return {
      // 这是数据表单的绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
        rememberMe: ''
      },
      // 这是验证部分
      login_rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '密码长度在 6 到 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
    //   console.log(this.$refs)
      this.$refs.loginFormRef.resetFields()
    },
    validateLoginForm () {
      const that = this
      that.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
          console.log(that.loginForm)
        login(that.loginForm).then(function (res) {
          console.log(res)
          if (res.status !== 200) {
            return that.$message.error('登录失败！')
          }
          that.$message.success('登录成功！')
          // 存储token
          // console.log(res.headers.authorization)
          window.sessionStorage.setItem('Authorization', res.headers.authorization)
          window.sessionStorage.setItem('username', that.loginForm.username)
          that.$router.push('/controller')
        })
          .catch(function (error) {
            console.log(error)
            return that.$message.error('用户名或密码错误!')
          })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login_container{
    // background-color: #ffffff;
    background-image: url('../assets/img/bg.jpg');
    height: 100%;
    .el-row{
      /*height: 100%;*/
      /*clear:both;*/
    .m-col {
      /*height: 100%;*/
      /*  width: 650px;*/
        .showImage{
            width: 120%;
            margin-top: 20%;
            /*width: 120%;*/
            /*position: relative;*/
            /*top: 50%;*/
            /*transform: translate(0,50%);*/
        }
        .login_box{
            width:500px;
            height:470px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0px 0px 20px #a7a7a7;
            border-radius: 3px;
            position: relative;
            left: 50%;
            /*top: 50%;*/
            margin-top: 20%;
            transform: translate(-50%);
            z-index: 1;
            .logo{
                width: 80%;
                padding: 10px;
                position: relative;
                left: 50%;
                transform: translate(-50%);
                background-color: #fff;
            }
            .welcome{
              text-align: center;
              color: #2288DD;
              font-size: 20px;
              font-weight: bold;
              padding: 10px 0;
            }
            .login_form{
                position: relative;
                top: -10%;
            }
            .el-button{
              width: 100%!important;
            }
        }
    }
    }
    .registerBox{
      display: flex;
      justify-content: space-between;
      padding-left: 0px;
      align-items: center;
      text-align: center;
      font-size: 14px;
      a {
        display:inline-block;
        width: 50%;
        color: #2288DD;
        text-decoration: none;
      }
    }
}
</style>
