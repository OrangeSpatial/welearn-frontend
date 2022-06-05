<template>
  <div class="task">
    <el-card shadow="never">
      <div slot="header">
        <span>用户管理</span>
        <el-button style="float: right; padding: 3px 0" icon="el-icon-edit" type="text">添加用户</el-button>
      </div>
      <el-table
        :data="userData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          >
        </el-table-column>
        <el-table-column
          label="id" v-if="show = false">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p>昵称: {{ scope.row.userAlias }}</p>
              <p>邮箱: {{ scope.row.userEmail }}</p>
              <p>手机: {{ scope.row.userPhone }}</p>
              <p>住址: {{ scope.row.userAddress }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.username }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.accountNonLocked ?"良好":"锁定" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户类别">
          <template slot-scope="scope">
            <span style="margin-left: 10px" >{{ scope.row.roles[0].nameZh }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上次登录">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.userLoginTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row), dialogFormVisible=true">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改用户信息" @closed="clearDiolog()" :visible.sync="dialogFormVisible">
      <el-form ref="editUserFormRef" class="login_form" :model="editUser" :rules="editUser_rules" status-icon>
          <el-form-item label="用户名" prop="username">
              <el-input suffix-icon="iconfont icon-user" disabled placeholder="用户名" v-model="editUser.username"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="userAlias">
              <el-input suffix-icon="iconfont icon-icon-test22" placeholder="昵称" v-model="editUser.userAlias"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userSex">
            <el-select v-model="editUser.userSex" suffix-icon="iconfont icon-icon-test23" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="">
            <el-select v-model="editUser.roleId" suffix-icon="iconfont icon-icon-test23" placeholder="请选择性别">
              <el-option label="管理员" value="7"></el-option>
              <el-option label="普通用户" value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
              <el-input suffix-icon="iconfont icon-icon-test20" placeholder="邮箱" v-model="editUser.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="userPhone">
              <el-input suffix-icon="iconfont icon-icon-test13" placeholder="电话" type="number" v-model.number="editUser.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="机构/地区" prop="userAddress">
              <el-input suffix-icon="iconfont icon-icon-test12" placeholder="机构/地区" v-model="editUser.userAddress"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="userNote">
              <el-input suffix-icon="iconfont icon-iconset0136" placeholder="备注" v-model="editUser.userNote"></el-input>
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
import { getAllUsers, update, delUser } from '../api/user'

export default {
  data () {
    return {
      roles: {},
      userData: [],
      editUser: {
        userAddress: '',
        userAlias: '',
        userEmail: '',
        userId: '',
        userNote: '',
        userPhone: '',
        userSex: '',
        userRole: ''

      },
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
    }
  },
  mounted () {
    this.findUsers()
  },
  computed: {
  },
  methods: {
    findUsers () {
      const that = this
      getAllUsers().then(res => {
        console.log(res.data)
        if (res.status !== 200) {
          return this.$message.error('数据库连接失败！请检查...')
        }
        that.userData = res.data
      })
    },
    handleEdit (index, row) {
      this.editUser = row
      console.log(row)
      this.editUser.roleId = row.roles[0].nameZh
      this.editUser.username = row.username
      this.editUser.userAlias = row.userAlias
      this.editUser.userSex = row.userSex
      this.editUser.userEmail = row.userEmail
      this.editUser.userPhone = row.userPhone
      this.editUser.userAddress = row.userAddress
      this.editUser.userNote = row.userNote
    },
    updateForm () {
      const that = this
      // const config = {
      //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
      //   data: that.$qs.stringify(that.editUser)
      // }
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid) {
          console.log(that.editUser)
          update(that.editUser).then(res => {
            if (res.status !== 200) {
              return that.$message.error('数据库连接失败！请检查...')
            }
            that.dialogFormVisible = false
            this.findUsers()
            return that.$message.success('更新成功！')
          }).catch(error => {
            console.log(error)
            return that.$message.error('数据库连接失败！请检查...')
          })
        }
      })
    },
    handleDelete (index, row) {
      delUser(row.userId).then(res => {
        // console.log(res.data)
        if (res.status !== 200) {
          return this.$message.error('数据库连接失败！请检查...')
        }
        this.findUsers()
        return this.$message.success('删除成功！')
      })
    },
    clearDiolog () {
      // this.$refs.editUserFormRef.resetFields()
    }
  }
}
</script>

<style lang='less' scoped>

.task{
  // background-color: aquamarine;
  height: 100%;
}

</style>
