<template>
  <div class="task">
    <el-card shadow="never">
      <div slot="header">
        <span>测试页面</span>
        <el-button style="float: right; padding: 3px 0" icon="el-icon-edit" type="text">编辑</el-button>
      </div>
      <el-upload
        ref="upload"
        action="/image/minio"
        multiple
        :file-list="fileList"
        :auto-upload="false"
        :http-request="uploadFile">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-divider></el-divider>
      <el-button type="primary" @click="handleDownLoad">下载</el-button>
      <el-progress :text-inside="true" :percentage="precent"></el-progress>
      <el-divider></el-divider>
      <el-button size="small" type="primary" @click="chooseFiles">选择文件夹</el-button>
      <div v-show="false">
        <input type="file" id="file" ref="file" webkitdirectory directory multiple="multiple" @change="handleFileUpload($event)" />
      </div>
      <div>
        <p class="uploadTip">请确保您上传文件夹中，只有图像文件(jpg/png/tif/tiff/bmp)</p>
      </div>
      <p class="uploadTip inputFileNum" v-text="loadedFiles"></p>
      <el-divider></el-divider>
      <canvas id="plot"></canvas>
      <div id="tif"></div>
    </el-card>
    <el-card>
      <el-upload
              class="upload-demo"
              action="http://192.168.10.1:8003/model/uploadFile"
              :data="{nodeId:'4028e61973717b13017371d47a700002'}"
              :headers="{Authorization: token}"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-divider></el-divider>
      <el-upload
              class="upload-demo"
              ref="modelUpload"
              drag
              action="http://192.168.10.1:8003/model/uploadFile"
              :data="{nodeId:'4028e61973717b13017371d47a700002'}"
              :headers="{Authorization: token}"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              multiple>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <el-progress :percentage="precent"></el-progress>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
import { minioUpload, minioDownload } from "../api/image";
import fileDownload from 'js-file-download'

export default {
  data () {
    return {
      fileList: [],
      formData: new FormData(),
      precent: 0,
      data: {
        id: ''
      },
      modeList: '',
      loadedFiles: '未选择任何文件',
        token: ''
    }
  },
  mounted () {
      this.token = window.sessionStorage.getItem('Authorization');
  },
  computed: {
  },
  methods: {
    uploadFile (file) {
      // console.log(file)
      this.formData.append('file', file.file)
    },
    submitUpload () {
      const that = this
      const formDataTemp = that.formData
      that.$refs.upload.submit()
      // console.log('ref')
      if (formDataTemp.get('file') === null) return that.$message.error('请选择文件！！')
      minioUpload(formDataTemp).then(res => {
        console.log(res)
        if (res.status !== 200) {
          return that.$message.error('上传失败！请联系管理员')
        } else {
          return that.$message.success('创建成功！')
        }
      })
    },
    async fileDownload () {
      // 先获取后台下载文件需要的数据
    },
    // 测试下载文件(注意web的上下文)
    async handleDownLoad () {
      // const imageSetId = '40289ed370d9b4640170d9b6207f0002'
      // const conf = {
      //   responseType: 'blob'
      // }
      // await this.$http.get('/image/zip/' + imageSetId, conf).then(response => {
        // const blob = new Blob([response.data], { type: 'application/zip' })
        // const url = window.URL.createObjectURL(blob)
        // window.location.href = url
        // return this.$message.success('下载完成')
      // })
      minioDownload().then(res=>{
        fileDownload(res.data, "a.jpg")
        // console.log(res)
        // const blob = new Blob([res.data], { type: 'image/jpeg' })
        // const url = window.URL.createObjectURL(blob)
        // window.location.href = url
        return this.$message.success('下载完成')
      })
    },
    chooseFiles () {
    },
    // 选择文件夹
    handleFileUpload () {
      this.modeList = document.getElementById('file').files
      var formdata = new FormData()
      var size = 0
      var temp = 1
      var num = 0
      this.modeList.forEach(element => {
        const reg = new RegExp('^(image/)(jpeg|tiff|png|bmp)')
        if (reg.test(element.type)) {
          num++
          size += element.size
          formdata.append('file', element)
          if (size > 2 * 1024 * 1024 * temp) {
            temp++
            console.log('大小' + size / 1024 / 1024 + 'MB =====' + temp)
            console.log(formdata.getAll('file'))
            formdata = null
            formdata = new FormData()
          }
        }
      })
      console.log(formdata.getAll('file'))
      // console.log('大小' + size / 1024 / 1024 + 'MB')
      this.loadedFiles = '选择了' + num + '文件'
    },
      handleRemove(file, fileList) {
          console.log(file, fileList);
      },
      handlePreview(file) {
          console.log(file);
      },
      handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file) {
          return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSuccess(res, file, fileList){
        console.log(res)
        console.log(file)
        console.log(fileList)
      },
      handleProgress(e, file, fileList){
        console.log(e)
        console.log(file)
        console.log(fileList)
          this.precent = e.loaded / e.total * 100 | 0
      }
  }
}
</script>

<style lang='less' scoped>

.task{
  // background-color: aquamarine;
  height: 100%;
}

.inputFileNum{
  margin-top: 5px;
  color: darkcyan!important;
}
.uploadTip{
  font-size: 12px;
  color: rgb(97, 97, 97);
}
</style>
