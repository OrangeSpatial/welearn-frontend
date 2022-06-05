<template>
    <div class="login_container">
        <el-row :gutter="10">
          <el-col :xs="0" :sm="16" :md="10" :lg="10" :xl="10">
            <!-- 图 -->
            <img class="showImage" src="../assets/img/show.png"/>
          </el-col>
          <el-col :xs="24" :sm="8" :md="14" :lg="14" :xl="14" class="m-col">
            <el-card class="login_box" shadow="hover">
              <!-- 输入框 -->
              <img src="../assets/img/DL_logo.png" alt="logo" class="logo">
              <div class="welcome">欢迎注册</div>
              <el-form ref="registerFormRef" class="login_form" :model="registerForm" :rules="register_rules" status-icon>
                  <el-form-item prop="username">
                      <el-input suffix-icon="iconfont icon-user" placeholder="用户名" v-model="registerForm.username"></el-input>
                  </el-form-item>
                  <el-form-item prop="userAlias">
                      <el-input suffix-icon="iconfont icon-icon-test22" placeholder="昵称" v-model="registerForm.userAlias"></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                      <el-input suffix-icon="iconfont icon-icon-test15" type="password" placeholder="输入密码，6~11位" v-model="registerForm.password"></el-input>
                  </el-form-item>
                  <el-form-item prop="check_password">
                      <el-input suffix-icon="iconfont icon-icon-test15" type="password" placeholder="请再次输入密码" v-model="registerForm.check_password"></el-input>
                  </el-form-item>
                  <el-form-item prop="userSex">
                    <el-select v-model="registerForm.userSex" suffix-icon="iconfont icon-icon-test23" placeholder="请选择性别">
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="userEmail">
                      <el-input suffix-icon="iconfont icon-icon-test20" placeholder="邮箱" v-model="registerForm.userEmail"></el-input>
                  </el-form-item>
                  <el-form-item prop="userPhone">
                      <el-input suffix-icon="iconfont icon-icon-test13" placeholder="电话" v-model.number="registerForm.userPhone"></el-input>
                  </el-form-item>
                  <el-form-item prop="userAddress">
                      <el-input suffix-icon="iconfont icon-icon-test12" placeholder="机构/地区" v-model="registerForm.userAddress"></el-input>
                  </el-form-item>
              </el-form>
              <!-- 按钮 -->
              <el-row class="loginbtn">
                  <el-button @click="validateRegisterForm()" type="primary">注册</el-button>
              </el-row>
              <el-divider/>
              <div class="registerBox">
                <router-link to="login">已有账户？去登陆 >></router-link>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>

<script>
  import {isRegister, register} from "../api/user";

  export default {
  data () {
    var validateUsername = async (rule, value, callback) => {
      await isRegister(value).then(function (res) {
        console.log(res)
        if (res.data.username === value) callback(new Error('用户名已存在！'))
      })
        .catch(function (error) {
          console.log(error)
          callback(new Error('数据库连接失败...'))
        })
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerFormRef.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 这是数据表单的绑定对象
      registerForm: {
        username: '',
        password: '',
        check_password: '',
        userAlias: '',
        userSex: '',
        userEmail: '',
        userPhone: '',
        userAddress: ''
      },
      // 这是验证部分
      register_rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 11, message: '密码长度在 6 到 11 个字符', trigger: 'blur' }
        ],
        check_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        userAlias: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        userPhone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { type: 'number', message: '电话必须为数字值' }
        ],
        userAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
    //   console.log(this.$refs)
      this.$refs.registerFormRef.resetFields()
    },
    validateRegisterForm () {
      const that = this
      that.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        await register(that.registerForm).then(function (res) {
          console.log(res)
          if (res.status !== 200) {
            that.resetForm()
            return that.$message.error('注册失败！')
          }
          that.$message.success('注册成功！')
          that.resetForm()
          that.$router.push('/login')
        })
          .catch(function (error) {
            console.log(error)
            return that.$message.error('数据获取失败，请联系管理员！')
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
    .showImage{
      width: 120%;
      margin-top: 20%;
    }
    .login_box{
        width:450px;
        height:100%;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0px 0px 20px #a7a7a7;
        border-radius: 3px;
        position: relative;
        left: 50%;
        // top: 50%;
        transform: translate(-50%);
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
    .el-select{
      width: 100%;
    }
    .registerBox{
      text-align: center;
      // display: flex;
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
