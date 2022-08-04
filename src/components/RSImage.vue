<template>
  <div class="rsimages">
    <div class="upload">
      <input type="file" ref="fileRef" style="display: none" accept=".tif,.tiff">
      <el-button size="small" type="primary" @click="getFiles">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" :disabled="!fileList.length" @click="submitUpload">上传到服务器</el-button>
      <div class="el-upload__tip">只能上传tif/tiff/img文件，且不超过2G</div>
      <div class="el-upload__tip" v-if="fileList.length">已选择 <b>{{fileList.length}}</b> 个文件</div>
    </div>
  </div>
</template>

<script>
// import Upload from "./Upload.vue";

import {uploadRSImage} from "../api/rsImages";

export default {
  name: "RSImage",
  // components: {Upload},
  data: () => {
    return {
      fileList: []
    }
  },
  methods: {
    submitUpload() {
      // this.$refs.upload.submit();
      const userId = window.sessionStorage.getItem("userId")
      const formData = new FormData();
      formData.append('userId', userId)
      this.fileList.forEach( file => {
        formData.append('file', file)
      })
      uploadRSImage(formData, e => {
        console.log((e.loaded/e.total).toFixed(2)*100)
      }).then(res => {
        console.log(res.data)
      })
    },
    getFiles() {
      this.$refs.fileRef.click()
    },
    init(){
      this.$refs.fileRef.addEventListener('change', () => {
        this.fileList = this.$refs.fileRef.files
        console.log(this.fileList)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>

</style>