<template>
  <span class="rsImage">
    <el-card class="rsimages" shadow="never">
    <div class="upload">
      <input type="file" ref="fileRef" style="display: none" multiple accept=".tif,.tiff">
      <el-button size="small" type="primary" @click="getFiles">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" :disabled="!fileList.length" @click="submitUpload">上传到服务器</el-button>
      <div class="el-upload__tip">只能上传tif/tiff/img文件，且不超过2G</div>
      <div class="el-upload__tip" v-if="fileList.length">已选择 <b>{{fileList.length}}</b> 个文件</div>
    </div>
    <TipBox title="影像上传" width="300px" v-model="progressPanel">
      <div>
        <el-progress :percentage="percentage"></el-progress>
      </div>
    </TipBox>
  </el-card>
  <el-card class="list" shadow="never">
    <div class="left">
      <div v-for="rsImage in rsImages" :key="rsImage.id">
        <el-link :underline="false" @click="showImage(rsImage)">{{rsImage.name}}</el-link>
      </div>
    </div>
    <div class="right">
      <div>
        <el-image :src="currentIamge.rgbFullPath" :preview-src-list="[currentIamge.rgbFullPath]">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </div>
  </el-card>
  </span>
</template>

<script>
import TipBox from "./common/TipBox.vue";

import {getRSImagesByUser, uploadRSImage} from "../api/rsImages";

export default {
  name: "RSImage",
  components: {TipBox},
  data: () => {
    return {
      userId: '',
      fileList: [],
      percentage: 0,
      progressPanel: false,
      rsImages: [],
      currentIamge: {rgbFullPath: ""}
    }
  },
  methods: {
    submitUpload() {
      // this.$refs.upload.submit();
      const formData = new FormData();
      formData.append('userId', this.userId)
      this.fileList.forEach( file => {
        formData.append('file', file)
      })
      this.progressPanel = true
      uploadRSImage(formData, e => {
        this.percentage = Math.round(e.loaded/e.total * 1000 ) / 10
      }).then(res => {
        console.log(res.data)
      })
    },
    getFiles() {
      this.$refs.fileRef.click()
    },
    showImage(image){
      this.currentIamge = image
    },
    init(){
      this.userId = window.sessionStorage.getItem("userId")
      this.$refs.fileRef.addEventListener('change', () => {
        this.fileList = this.$refs.fileRef.files
        console.log(this.fileList)
      })
      getRSImagesByUser(this.userId).then(res => {
        console.log(res.data)
        this.rsImages = res.data
      })
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.$refs.fileRef.removeEventListener('change', () => {
      this.fileList = this.$refs.fileRef.files
    })
  }
}
</script>

<style lang="less" scoped>
.rsImage{
  display: flex;
  flex-direction: column;
  gap: 16px;
  .list{
    ::v-deep.el-card__body{
      display: flex;
      .left{
        width: 320px;
      }
      .right{
        flex: 1;
      }
    }
  }
}

</style>