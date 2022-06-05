<template>
  <div class="category">
    <el-card shadow="never">
      <div slot="header">
        <span>数据分类规则</span>
        <el-button style="float: right; padding: 3px 0" @click="dialogUploadFormVisible = true" icon="el-icon-edit" type="text">上传更新分类图</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card
          body-style="height: inherit"
          shadow="hover">
            分类规则介绍：
            <el-divider></el-divider>
            <div class="introInfo">
              此数据及根据xxxx对xxx进行归类，分类，融合得到如右图结果（点击放大，点击中间 [1:1], 拖动查看）。
            </div>
          </el-card>
          <el-card
          class="box-card"
          body-style="height: inherit"
          shadow="hover">
            添加训练类型：
            <el-divider></el-divider>
            <el-form :inline="true" ref="typeFormRef" :rules="typeFormRules" :model="typeForm">
              <el-form-item prop="name" label="训练类型">
                <el-input v-model="typeForm.name"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="typeSubmit()">提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card
          class="box-card"
          body-style="height: inherit"
          shadow="hover">
            添加分类：
            <el-divider></el-divider>
            <el-form :inline="true" :model="categoryForm">
              <el-form-item label="第一级">
                <el-input v-model="categoryForm.first"></el-input>
              </el-form-item>
              <el-form-item label="第二级">
                <el-input v-model="categoryForm.second"></el-input>
              </el-form-item>
              <el-form-item label="第三级">
                <el-input v-model="categoryForm.third"></el-input>
              </el-form-item>
              <el-form-item label="第四级">
                <el-input v-model="categoryForm.fourth"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit()">提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card style="line-height:30px; color:#aaaaaa; text-align: center; font-size: 10px">
            <span>点击放大，点击中间 [1:1], 拖动查看</span>
            <el-image
            :src="url"
            :preview-src-list="[url]">
          </el-image>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 上传表单 -->
    <el-dialog title="上传分类图" width='35%' :visible.sync="dialogUploadFormVisible">
      <el-card shadow="hover">
        <!-- 上传影像 -->
        <div class="upload-title">
        </div>
        <el-upload
          ref="upload_img"
          accept='image/bmp,image/jpeg,image/png,.svg'
          drag
          :auto-upload="false"
          :http-request="uploadFile"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传图片，且单文件不超过5MB</div>
        </el-upload>
        <el-divider></el-divider>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submit">上传到服务器</el-button>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { categoryUpload, checkName, getImage,insertType,insertCategory } from '../api/category'

export default {
  data: function () {
      const validateName = async (rule, value, callback) => {
          await checkName(value).then(res=>{
              console.log(res)
              if (res.data === value) {
                  callback(new Error('类型名称已存在！'))
              }
          }).catch(err =>{
              callback(new Error('数据库连接失败...'+err))
          })
      };
      return {
      dialogUploadFormVisible: false,
      url: '',
      typeForm: {
        name: ''
      },
      typeFormRules: {
        name: [
          { required: true, message: '请输入训练类型名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      categoryForm: {
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: ''
      },
      categoryData: new FormData()
    }
  },
  created () {
  },
  methods: {
    async getImage () {
      getImage().then(res => {
        console.log(res)
        if (res.status !== 200) {
          return this.$message.error('图片不存在')
        }
        this.url = res.data
      })
    },
    uploadFile (file) {
      console.log(file)
      this.categoryData.append('file', file.file)
    },
    submit () {
      this.$refs.upload_img.submit()
      categoryUpload(this.categoryData).then(res => {
        console.log(res)
        if (res.status !== 200) return this.$message.error('上传失败！请联系管理员')
        // console.log(res.data)
        this.$refs.upload_img.clearFiles()
        return this.$message.success('上传成功！')
      })
    },
    async typeSubmit () {
      const that = this
      that.$refs.typeFormRef.validate(async valid => {
        if (!valid) return
          insertType(that.typeForm).then(res=>{
              console.log(res.data)
              if (res.status !== 200) {
                  return that.$message.error('保存失败！')
              }
              return that.$message.success('保存成功！')
          })
      })
    },
    async onSubmit () {
        insertCategory(this.categoryForm).then(res=>{
            console.log(res.data)
            if (res.status !== 200) {
                return this.$message.error('保存失败！')
            }
            return this.$message.success('保存成功！')
        })
    }
  },
  mounted () {
    this.getImage()
  }
}
</script>

<style lang='less' scoped>

.category{
  // background-color: aquamarine;
  height: 100%;
}

.introInfo{
  text-align: justify;
  line-height: 30px;
  color: #888888;
}

.box-card{
  margin-top: 5px;
}

</style>
