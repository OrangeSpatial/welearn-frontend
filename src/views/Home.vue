<template>
  <div id="home">
    <el-container>
      <el-header>
          <div class="m-display">
            <div class="m-logo" @click="handleClick(0)">
              <img src="../assets/img/logo.png" style="margin-bottom: -8px" width="225px" alt="logo">
            </div>
            <div :class="item.id == index ? 'm-memu-item m-is-active': 'm-memu-item'"  @click="handleClick(item.id)" v-for="item in menu" :key="item.id">{{item.name}}</div>
          </div>
          <div class="m-display">
            <div :class="10 == index ? 'm-memu-item m-is-active': 'm-memu-item'"  @click="handleClick(10)">登录</div>
          </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        深度学习云平台 &copy;2020 WHU
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
      return {
        menu: [
          {id:1, name: '影像集'},
          {id:2, name: '模型'},
          {id:3, name: '工具'}
        ],
        isActive: false,
        index: 0,
      };
    },
    methods: {
      handleClick(index) {
        switch(index){
          case 1:
            this.$router.push('/images');
            break;
          case 2:
            this.$router.push('/models');
            break;
          case 3:
            this.$router.push('/tools');
            break;
          case 10:
            this.$router.push('/login');
            break;
          default:
            this.$router.push('/');
        }
        this.index = index
      }
    }
}
</script>

<style lang="less" scoped>
#home{
  height: 100%;
  background-color: rgb(19, 32, 59);
  .el-container {
    height: 100%;
    .el-header{
        margin-left: auto;
        margin-right: auto;
        width: 90%;
        display: flex;
        justify-content: space-between;
        .m-display{
          color: #ffffff;
          display: inline-block;
          div:hover{
            cursor: pointer;
          }
        }
        .m-logo{
          display: inline-block;
          width: 225px;
        }
        .m-memu-item{
          height: 60px;
          line-height: 60px;
          display: inline-block;
          padding: 0 20px;
        }
        .m-memu-item:hover{
          background-color: rgb(23, 40, 75);
        }
        .m-is-active{
          background-color: rgb(27, 46, 87);
        }
    }
    .el-main{
      color: #ffffff;
      margin: 0 auto;
      width: 80%;
      min-width: 500px;
      max-width: 1150px;
      height: 100%;
    }
    .el-footer {
      height: 40px!important;
      line-height: 40px;
      // background-color: rgb(117, 226, 226);
      padding-left: 0px;
      color: #c2bebc;
      text-align: center;
    }
  }
}
</style>
