<template>
  <div class="task">
    <el-card shadow="never">
      <div slot="header">
        <span>历史记录</span>
<!--        <el-button style="float: right; padding: 3px 0" icon="el-icon-edit" type="text">编辑</el-button>-->
      </div>
      <div class="block">
        <div class="radio">
          排序：
          <el-radio-group v-model="reverse">
            <el-radio :label="true">倒序</el-radio>
            <el-radio :label="false">正序</el-radio>
          </el-radio-group>
        </div>
        <el-timeline :reverse="reverse">
          <el-timeline-item v-for="item in logsData" :key="item.logId" :timestamp="item.createTime" placement="top">
            <el-card>
              <p style="font-size: 16px">
                <el-tag style="color: white;margin-right: 20px" :color="item.logsColor">{{item.execStatus}}</el-tag>
                {{item.execName}}：{{item.execContent}}
              </p>
              <p>{{item.username}} 提交于 {{item.createTime}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getLogsByUsername} from "../api/logs";

export default {
  data () {
    return {
        reverse: true,
        logsData: []
    }
  },
  mounted () {
      this.init()
  },
  computed: {
  },
  methods: {
      init(){
          const username = window.sessionStorage.getItem("username");
          getLogsByUsername(username).then(res=>{
              console.log(res)
              if(res.status !==200 ) return
              this.logsData = res.data
          })
      }
  }
}
</script>

<style lang='less' scoped>

.task{
  // background-color: aquamarine;
  height: 100%;
  .radio{
    padding: 20px;
    text-align: center;
  }
}

</style>
