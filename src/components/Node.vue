<template>
  <div class="task">
    <el-card shadow="never">
      <div slot="header">
        <span>节点管理</span>
        <el-button style="float: right; padding: 3px 0" @click="dialogFormVisible = true" icon="iconfont icon-add-fill" type="text">添加节点</el-button>
      </div>
      <el-card>
        <el-table
        :data="nodeData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          >
        </el-table-column>
        <el-table-column label="id" v-if="show = false">
          <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.nodeId }}</span></template>
        </el-table-column>
        <el-table-column label="username" v-if="show = false">
          <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.username }}</span></template>
        </el-table-column>
        <el-table-column label="password" v-if="show = false">
          <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.password }}</span></template>
        </el-table-column>
        <el-table-column label="status" v-if="show = false">
          <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.status }}</span></template>
        </el-table-column>
        <el-table-column label="systemType" v-if="show = false">
          <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.systemType }}</span></template>
        </el-table-column>
        <el-table-column
          label="操作系统"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.operationSystem }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="节点IP"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.nodeIp }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="python版本"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.anacondaPython }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="CUDA 版本"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cudaVersion }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="cuDNN 版本"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cudnnVersion }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="训练环境"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.trainEnvironment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row),dialogFormVisible1 = true">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      </el-card>
      <el-dialog title="添加主机节点" @closed="clearDiolog()" :visible.sync="dialogFormVisible">
        <el-form label-position="top" :model="nodeForm" ref="nodeFormRef" :rules="nodeRules">
          <!-- 隐藏start -->
          <el-form-item label="id" prop="nodeId" v-if="show = false">
            <el-input v-model="nodeForm.nodeId"></el-input>
          </el-form-item>
          <el-form-item label="status" prop="status" v-if="show = false">
            <el-input v-model="nodeForm.status"></el-input>
          </el-form-item>
          <el-form-item label="delStatus" prop="delStatus" v-if="show = false">
            <el-input v-model="nodeForm.delStatus"></el-input>
          </el-form-item>
          <!-- 隐藏end -->
          <el-form-item
          label="节点IP"
          prop="nodeIp"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.nodeIp" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="主机用户名" prop="username" >
            <el-input v-model="nodeForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="nodeForm.password"></el-input>
          </el-form-item>
          <el-form-item label="系统类型" prop="systemType">
            <el-select v-model="nodeForm.systemType" clearable placeholder="请选择">
              <el-option
                v-for="item in systemTypes"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作系统名称及版本 （windows 10-1909，Ubuntu 18.04）"
          prop="OperationSystem"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.operationSystem" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="python版本"
          prop="anacondaPython"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.anacondaPython" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="CUDA版本"
          prop="cudaVersion"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.cudaVersion" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="cuDNN版本"
          prop="cudnnVersion"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.cudnnVersion" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="训练环境介绍（配置框架）"
          prop="trainEnvironment"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.trainEnvironment" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注（硬件等）"
          prop="comment"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm.comment" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="addNode('nodeFormRef')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改主机节点" @closed="clearDiolog1()" :visible.sync="dialogFormVisible1">
        <el-form label-position="top" :model="nodeForm1" ref="nodeForm1Ref" :rules="nodeRules">
          <!-- 隐藏start -->
          <el-form-item label="id" prop="nodeId" v-if="show = false">
            <el-input v-model="nodeForm1.nodeId"></el-input>
          </el-form-item>
          <el-form-item label="status" prop="status" v-if="show = false">
            <el-input v-model="nodeForm1.status"></el-input>
          </el-form-item>
          <el-form-item label="delStatus" prop="delStatus" v-if="show = false">
            <el-input v-model="nodeForm1.delStatus"></el-input>
          </el-form-item>
          <!-- <el-form-item label="createTime" prop="createTime" v-if="show = false">
            <el-input v-model="nodeForm1.createTime"></el-input>
          </el-form-item> -->
          <!-- 隐藏end -->
          <el-form-item
          label="节点IP"
          prop="nodeIp"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.nodeIp" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="系统类型" prop="systemType">
            <el-select v-model="nodeForm1.systemType" clearable placeholder="请选择">
              <el-option
                v-for="item in systemTypes"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作系统名称及版本 （windows 10-1909，Ubuntu 18.04）"
          prop="OperationSystem"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.operationSystem" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="python版本"
          prop="anacondaPython"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.anacondaPython" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="CUDA版本"
          prop="cudaVersion"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.cudaVersion" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="cuDNN版本"
          prop="cudnnVersion"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.cudnnVersion" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="训练环境介绍（配置框架）"
          prop="trainEnvironment"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.trainEnvironment" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="备注（硬件等）"
          prop="comment"
          :label-width="formLabelWidth">
            <el-input v-model="nodeForm1.comment" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1=false">取 消</el-button>
          <el-button type="primary" @click="addNode('nodeForm1Ref')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { findAll, insert } from '../api/node'

export default {
  data () {
    const validIP = (rule, value, callback) => {
      const reg = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的IPv4地址，如：8.8.8.8， 各数值不能大于255小于0'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      formLabelWidth: '100px',
      systemTypes: [
        {
          id: '01',
          value: 'Windows'
        },
        {
          id: '02',
          value: 'Linux'
        }
      ],
      nodeForm: {
        nodeId: '',
        nodeIp: '',
        username: '',
        password: '',
        anacondaPython: '',
        cudaVersion: '',
        cudnnVersion: '',
        trainEnvironment: '',
        comment: '',
        OperationSystem: '',
        systemType: '',
        status: 0,
        delStatus: 0
      },
      nodeForm1: {
        nodeId: '',
        nodeIp: '',
        username: '',
        password: '',
        anacondaPython: '',
        cudaVersion: '',
        cudnnVersion: '',
        trainEnvironment: '',
        comment: '',
        OperationSystem: '',
        systemType: '',
        status: 0,
        delStatus: 0
      },
      nodeRules: {
        nodeIp: [
          { required: true, message: '节点IP不能为空', trigger: 'blur' },
          { validator: validIP, trigger: 'blur' }
        ],
        anacondaPython: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        cudaVersion: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        systemType: [{ required: true, message: '请选择系统类别', trigger: 'change' }],
        cudnnVersion: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        trainEnvironment: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        operationSystem: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
      },
      nodeData: []
    }
  },
  mounted () {
    this.findNodes()
  },
  computed: {
  },
  methods: {
    async findNodes () {
      const that = this
      findAll().then(res => {
        if (res.status !== 200) {
          return this.$message.error('数据库连接失败！请检查...')
        }
        console.log(res.data)
        that.nodeData = res.data
      })
    },
    addNode (form) {
      const that = this
      this.$refs[form].validate(valid => {
        if (valid) {
          if (form === 'nodeFormRef') {
            insert(that.nodeForm).then(res=>{
            console.log(res)
            if (res.status !== 200) {
              return this.$message.error('数据库连接失败！请检查...')
            }
            that.findNodes()
            this.dialogFormVisible = false
            })
            return this.$message.success('添加成功！')
          }
          if (form === 'nodeForm1Ref') {
            insert(that.nodeForm1).then(res=>{
            console.log(res)
            if (res.status !== 200) {
              return this.$message.error('数据库连接失败！请检查...')
            }
            that.findNodes()
            this.dialogFormVisible1 = false
            return this.$message.success('修改成功！')
            })
          }
        }
      })
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    },
    clearDiolog () {
      this.$refs.nodeFormRef.resetFields()
    },
    clearDiolog1 () {
      this.$refs.nodeForm1Ref.resetFields()
    },
    handleEdit (index, row) {
      this.nodeForm1 = row
      // this.nodeForm1.operationSystem = row.operationSystem
    },
    handleDelete (index, row) {
      this.nodeForm1 = row
      // this.nodeForm1.OperationSystem = row.operationSystem
      this.nodeForm1.delStatus = 1
      // console.log(this.nodeForm1.operationSystem)
      insert(this.nodeForm1).then(res=>{
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error('数据库连接失败！请检查...')
      }
      this.findNodes()
      return this.$message.success('删除成功！')
      })
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
