<template>
    <el-container class="start_container">
      <el-header>
        <div>
          <img class="logo" @click="toIndex" src="../assets/img/DL_logo.png" alt="" />
          <span>深度学习云平台</span>
        </div>
        <div>
          <el-link class="help" :underline="false" >帮助</el-link>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
          深度学习云平台 &copy;2020 WHU
      </el-footer>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    toIndex(){
      this.$router.push('/')
    }
  }
}
</script>

<style lang='less' scoped>
.start_container{
    // background-color: #ffffff;
    background-image: url('../assets/img/bg.jpg');
    height: 100%;
    .el-header {
      background-color: #00c8cf;
      box-shadow: 0px 1px 1px #888;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding-left: 0px;
      align-items: center;
      font-size: 20px;
      div{
        display: flex;
        align-items: center;
        img {
            width: 40%;
            border-radius: 50%;
          }
        span {
          font-size: 24px;
        }
      }
    }

    .logo:hover{
      cursor: pointer;
    }

    .help{
      color: white;
      font-size: 18px;
    }

    .el-footer {
      height: 40px!important;
      width: 100%;
      line-height: 40px;
      background-color: rgb(117, 226, 226);
      padding-left: 0px;
      color: #ffffff;
      text-align: center;
    }
}
</style>
