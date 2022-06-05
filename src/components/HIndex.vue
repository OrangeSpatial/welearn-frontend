<template>
  <div id="h-index">
    <div class="introduction">
      <p class="title">打造世界上最大的公开遥感影像数据集</p>
      <p class="subtitle">已收集公开样本集主要有4类，90多个数据集，样本数约200万个，大小约4TB</p>
      <p class="info">
        <span>{{imageSettotal}}</span> 数据集，
        约 <span>{{Math.round(imageTotal/10000)}}</span> 万样本，
        <span>{{imagesStorageGB > 1024? Math.round(imagesStorageGB/1024*100)/100+"GB":imagesStorageGB+"MB"}}</span>
      </p>
      <router-link style="color: #eeeeee" to="Tools">使用说明 >></router-link>
    </div>
    <div class="images">
      <el-image v-for="url in images" :key="url.link" :src="url.link" lazy/>
    </div>
  </div>
</template>

<script>
import { getDLtype } from "../api/category";
import { findImageByTypeAndTag } from "../api/image";
import {getStatistic} from "../api/hello"

export default {
  data() {
    return {
      dlType: [],
      images: [],
        imageSettotal: 0,
        imageTotal: 0,
        imageCategoryTotal: 0,
        imagesStorageGB: 0
    };
  },
  mounted() {
    this.getDltype();
    this.getImageSet();
  },
  methods: {
    getDltype() {
      getDLtype().then(res => {
        if (res.status !== 200) {
          return;
        } else {
          console.log(res.data);
          this.dlType = res.data;
          this.getImagesBydlType();
        }
      });
    },
    getImagesBydlType() {
      // 获取索引数
      var index = Math.floor(Math.random() * this.dlType.length);
      console.log("dddddd", index);
      findImageByTypeAndTag(this.dlType[index], 0).then(res => {
        console.log(res.data);
        if (res.status === 200) {
          this.images = res.data;
        }
      });
    },
      getImageSet(){
          getStatistic().then(res=>{
              console.log(res)
              if(res.status !== 200 )return
              this.imageSettotal = res.data.imageSettotal;
              this.imageTotal = res.data.imageTotal;
              this.imageCategoryTotal = res.data.tagsSize;
              this.imagesStorageGB = res.data.imagesStorageGB;
          })
      }
  }
};
</script>

<style lang="less" scoped>
#h-index {
  text-align: center;
  .introduction {
    padding: 20px 0;
    // height: 50%;
    .title {
      font-size: 40px;
    }
    .subtitle {
      color: #ee9900;
      font-size: 20px;
    }
    .info {
      font-size: 20px;
      color: #aaaaaa;
    }
  }
  .images {
    height: 400px;
    overflow-y: auto;
    .el-image{
        padding: 5px;
    }
  }
  .images::-webkit-scrollbar {
    width: 6px;
  }
  .images::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(5, 170, 182, 0.4);
  }
}
</style>
