<template>
  <div id="index-container">
    <el-card
      style="text-align: center; margin-bottom:10px; color: #0080d8"
      shadow="hover"
    >
      {{ welcome }}, 欢迎回来 {{user.username}}~~！
    </el-card>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card shadow="hover" class="m-height">
          <el-avatar
            :size="130"
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          ></el-avatar>
          <h3 style="color:#0085d8;">{{ user.username }}</h3>
          <div class="detail">
            <div class="m-layout">
              <i class="el-icon-phone-outline"></i>
              <span class="info">{{ user.userPhone }}</span>
            </div>
            <div class="m-layout">
              <i class="el-icon-message"></i>
              <span class="info">{{ user.userEmail }}</span>
            </div>
            <div class="m-layout">
              <i class="el-icon-coordinate"></i>
              <span class="info">{{ user.userAddress }}</span>
            </div>
          </div>
          <el-button class="editUser" icon="el-icon-edit" @click="dialogFormVisible=true" size="mini">编辑</el-button>
          <el-divider></el-divider>
          <el-tag
            v-for="item in items"
            :key="item.label"
            :type="item.type"
            effect="plain"
          >
            {{ item.label }}
          </el-tag>
          <div class="expostulation">
            趁你现在还有时间，尽你自己最大的努力，努力做成你最想做的那件事，成为你最想成为的那种人，过着你最想过的那种生活。这个世界永远比你想的要更精彩，不要败给生活。
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <div class="announcement">
            <i class="el-icon-chat-line-round" style="font-size:20px;color: #DD4A68;"/>
            <span class="content">
              <span class="info-box">
                <span>{{announcement}}</span>
              </span>
            </span>
          </div>
        </el-card>
        <el-card class="album" shadow="hover">
          <p>影集</p>
          <div class="bImage">
            <el-image v-for="url in urls" :key="url" :src="url" lazy></el-image>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="修改用户信息" @closed="clearDiolog()" :visible.sync="dialogFormVisible">
      <el-form ref="editUserFormRef" class="login_form" :model="user" :rules="editUser_rules" status-icon>
          <el-form-item label="用户名" prop="username">
              <el-input suffix-icon="iconfont icon-user" disabled placeholder="用户名" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="userAlias">
              <el-input suffix-icon="iconfont icon-icon-test22" placeholder="昵称" v-model="user.userAlias"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
              <el-input suffix-icon="iconfont icon-icon-test20" placeholder="邮箱" v-model="user.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="userPhone">
              <el-input suffix-icon="iconfont icon-icon-test13" placeholder="电话" type="number" v-model.number="user.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="机构/地区" prop="userAddress">
              <el-input suffix-icon="iconfont icon-icon-test12" placeholder="机构/地区" v-model="user.userAddress"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="userNote">
              <el-input suffix-icon="iconfont icon-iconset0136" placeholder="备注" v-model="user.userNote"></el-input>
          </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <el-row class="loginbtn">
          <el-button @click="updateForm()" type="primary">修改</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { timeFix } from "@/utils/util";
import { update,getUserByName } from '../api/user'

export default {
  data() {
    return {
        announcement: "版本更新1.1.10，任务直接删除，首页统计信息更新，增加日志，修复影像上传部分失败问题等                    ",
        announceContent: "",
      welcome: "",
      user: {},
      editUser: {},
      items: [
        { type: "", label: "打球" },
        { type: "success", label: "唱歌" },
        { type: "info", label: "读书" },
        { type: "danger", label: "看电影" },
        { type: "success", label: "旅游" },
        { type: "warning", label: "扯淡" }
      ],
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
      ],
      dialogFormVisible: false,
      editUser_rules: {
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
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        userAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.welcome = timeFix();
    this.getUser();
    this.changeAnnouncement()
  },
  methods: {
      changeAnnouncement(){
          var text = this.announcement;
          this.announceContent = text;
          var content = [];
          for(let j=0; j<text.length;j++){
              content.push(text[j])
          }
          console.log(content)
          console.log(this.announceContent)
          setInterval(function() {
              content.shift()
              content.push(content[0])
              this.announceContent = content.toString();
          }, 1000)
          // if (i > 10) { // 因为i++的原因，所以当i的值大于数组的长度-1的时候，清除定时器
          //     clearInterval(timer)
          // }
      },
    getUser() {
        const username = sessionStorage.getItem("username");
        getUserByName(username).then(res=>{
          if(res.status !==200)return
          this.user = res.data
        })
        // this.user = this.$store.state.user
        console.log(this.user)
    },
    updateForm () {
      const that = this
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid) {
            that.editUser.userAlias = that.user.userAlias
            that.editUser.userEmail = that.user.userEmail
            that.editUser.userPhone = that.user.userPhone
            that.editUser.userAddress = that.user.userAddress
            that.editUser.userNote = that.user.userNote
            that.editUser.username = that.user.username
            that.editUser.userSex = that.user.userSex
            that.editUser.roleId = that.user.roles[0].id
            update(that.editUser).then(res => {
                if (res.status !== 200) {
                    return that.$message.error('数据库连接失败！请检查...')
            }
            console.log(res.data)
            // that.editUser = {}
            that.user = res.data.data
            that.dialogFormVisible = false
            return that.$message.success('更新成功！')
          }).catch(error => {
            console.log(error)
            return that.$message.error('数据库连接失败！请检查...')
          })
        }
      })
    },
    clearDiolog () {
      this.editUser = this.user
      this.$refs.editUserFormRef.resetFields()
    }
  }
};
</script>

<style lang="less" scoped>
#index-container {
  .m-height {
    height: 760px;
    text-align: center;
    .el-tag,
    .el-tag--plain {
      margin: 10px;
    }
    .expostulation {
      padding: 10px;
      color: #999999;
      text-align: justify;
      margin-top: 10px;
      line-height: 28px;
      letter-spacing: 2px;
    }
  }
  .m-layout {
    margin-top: 20px;
    text-align: left;
    // display: flex;
    // justify-content: space-between;
    padding: 0 50px;
    i {
      color: #12b196;
      text-shadow: 5px 5px 10px;
    }
    .info {
      display: inline;
      padding-left: 30px;
      letter-spacing: 2px;
      color: rgb(122, 122, 122);
    }
  }
  .announcement{
    height: 25px;
    overflow: hidden;
    i {
      color: #DD4A68;
      text-shadow: 5px 5px 10px;
    }
    @keyframes anis {
      100% {
        transform:translateY(-30px)
      }
    }img {
       position:absolute;
     }
    .info-box{
      display: inline-block;
      animation:anis 6s linear infinite;
      padding-left: 20px;
      color: #888888;
    }
    .info-box:hover{
      animation-play-state:paused;
    }
    .content{
      display: block;
      float: right;
      width: 95%;
      overflow: hidden;
      margin-left: 15px;
      line-height: 40px;
    }
  }
  .album{
    margin-top: 10px;
    text-align: center;
    .bImage {
      height: 590px;
      padding: 0 5px;
      overflow: auto;
    }
    .bImage::-webkit-scrollbar {
      width: 6px;
    }
    .bImage::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(5, 170, 182, 0.4);
    }
  }
  .editUser{
      margin-top: 20px;
      width: 100%;
  }
}
</style>
