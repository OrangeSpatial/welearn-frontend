<template>
  <el-container class="controller-container">
    <el-header>
      <div>
        <img src="../assets/img/DL_logo.png" alt="" />
        <span>深度学习云平台</span>
      </div>
      <div>
        <router-link to="/home/individual">
          <el-popover
            placement="top-start"
            trigger="hover"
            popper-class="minWidth"
            content="个人信息"
          >
            <el-avatar
                    slot="reference"
                    :size="45"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </el-popover>
        </router-link>
        <el-popover
          placement="top-start"
          trigger="hover"
          popper-class="minWidth"
          content="退出登录"
        >
          <el-button
            slot="reference"
            class="iconfont icon-tuichu1"
            @click="logout()"
            circle
          ></el-button>
        </el-popover>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="!isCollapse ? '64px' : '170px'">
        <div class="aTB" v-text="aDirection" @click="aToggle()"></div>
        <el-menu
          background-color="#fff"
          text-color="#000"
          active-text-color="#026bee"
          unique-opened
          :collapse-transition="false"
          router
          :default-active="activePath"
          :collapse="!isCollapse"
        >
          <el-menu-item
            v-for="item in menus"
            :key="item.link"
            @click="saveIndex(item.link)"
            :index="item.link"
          >
            <i :class="item.icon"/>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
        <div class="aTB" v-text="aDirection" @click="aToggle()"></div>
      </el-aside>
        <el-main>
          <router-view/>
        </el-main>
    </el-container>
    <el-footer>
      深度学习云平台 &copy;2020 WHU
    </el-footer>
  </el-container>
</template>

<script>
import { getUserByName } from "../api/user";

export default {
  data() {
    return {
        menus: [],
      adminMenus: [
        { icon: "iconfont icon-shouye", index: "/controller/welCome", title: "首页" },
        {
          icon: "iconfont icon-yonghu1",
          index: "/controller/users",
          title: "用户管理",
        },
        {
          icon: "iconfont icon-leibie",
          index: "/controller/category",
          title: "数据分类",
        },
        {
          icon: "iconfont icon-shuju5",
          index: "/controller/imageSet",
          title: "数据管理",
        },
        {
          icon: "iconfont icon-shuju1",
          index: "/controller/auditImageSet",
          title: "数据审核",
        },
        {
          icon: "iconfont icon-moxing1",
          index: "/controller/model",
          title: "模型管理",
        },
        {
          icon: "iconfont icon-zhuji2",
          index: "/controller/node",
          title: "节点管理",
        },
        {
          icon: "iconfont icon-renwu3",
          index: "/controller/task",
          title: "任务管理",
        },
        {
          icon: "iconfont icon-lishijilu",
          index: "/controller/history",
          title: "历史记录",
        },
        {
          icon: "iconfont icon-xitong1",
          index: "/controller/setting",
          title: "系统功能",
        },
        { icon: "el-icon-finished", index: "/controller/test", title: "测试项" },
      ],
      userMenus: [
          { icon: "iconfont icon-shouye", index: "/controller/welCome", title: "首页" },
          {
              icon: "iconfont icon-shuju5",
              index: "/controller/imageSet",
              title: "数据管理",
          },
          {
              icon: "iconfont icon-moxing1",
              index: "/controller/model",
              title: "模型管理",
          },
          {
              icon: "iconfont icon-renwu3",
              index: "/controller/task",
              title: "任务管理",
          },
          {
              icon: "iconfont icon-lishijilu",
              index: "/controller/history",
              title: "历史记录",
          }
      ],
      aDirection: "《",
      isCollapse: true,
      activePath: "/controller/welCome",
    };
  },
  created() {
    // this.saveIndex(this.activePath)
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    async getUserType() {
      const username = window.sessionStorage.getItem("username");
      if (this.menus.length === 0) {
        getUserByName(username).then((res) => {
          if (res.status !== 200) return;
          console.log(res);
          this.menus = res.data.roles[0].menus;
          window.sessionStorage.setItem("userId", res.data.userId)
          this.$store.commit("getCurrentUser", res.data);
        });
      }
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 切换侧边栏
    aToggle() {
      if (this.isCollapse) {
        this.aDirection = "》";
      } else {
        this.aDirection = "《";
      }
      this.isCollapse = !this.isCollapse;
    },
    // 保存激活状态
    saveIndex(link) {
      window.sessionStorage.setItem("activePath", link);
      this.activePath = link;
      // console.log(index)
    },
  },
  mounted() {
    this.getUserType();
  },
};
</script>

<style lang="less" scoped>
.controller-container {
  height: 100%;
  #content-container {
    background-color: aliceblue;
  }
}
.el-header {
  background-color: #00c8cf;
  box-shadow: 0px 1px 2px #888;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    img {
      width: 35%;
      border-radius: 50%;
    }
    span {
      font-size: 20px;
    }
  }
}

.is-circle {
  margin: 0 5px;
}

.el-aside {
  position: relative;
  // margin: 10px 0;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 0 3px 3px 0;
  background-color: #ffffff;
  // height: 343px;
  box-shadow: 1px 0px 4px #888;
  .el-menu {
    border-right: none;
  }
  .aTB {
    cursor: pointer;
    height: 30px;
    color: #4827b6;
    line-height: 30px;
    text-align: center;
    background-color: #ffffff;
    border-bottom: 1px solid #00d800;
    // border-radius: 0 10px 8px 0;
  }
}
.el-footer {
  height: 40px !important;
  width: 100%;
  line-height: 40px;
  background-color: rgb(117, 226, 226);
  padding-left: 0px;
  color: #ffffff;
  text-align: center;
}
</style>

<style lang="less">
.el-popover {
  min-width: 0px !important;
  padding: 10px 12px !important;
}
</style>
