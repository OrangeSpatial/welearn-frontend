<template>
<div class="tip-box" :style="{'width': width}" v-show="visible" ref="tipRef">
  <div class="header">
    <span class="title">{{title}}</span>
    <i class="el-icon-close" @click="close"></i>
  </div>
  <div class="body">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "TipBox",
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    title: String,
    width: String,
    visible: Boolean
  },
  data() {
    return {
    }
  },
  methods: {
    close(){
      this.visible = false
      this.$emit('change', this.visible)
    }
  },
  mounted() {
    document.body.append(this.$refs.tipRef);
  }
}
</script>

<style lang="less" scoped>
.tip-box{
  border-radius: 4px;
  position: absolute;
  bottom: 20px;
  right: 6px;
  background-color: white;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  .header{
    display: flex;
    justify-content: space-between;
    padding: 4px;
    .el-icon-close{
      cursor: pointer;
    }
    .el-icon-close:hover{
      color: #00c8cf;
    }
  }
  .body{
    padding: 5px;
  }
}
</style>