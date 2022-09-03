<template>
  <div class="category">
    <el-card shadow="never">
      <div slot="header">
        <span>数据分类规则</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
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
            <div class="dl-type-list">
              <span class="type-title">已添加类别：</span>
              <span class="type-item" v-for="item in categoryData" :key="item">{{item}}</span>
            </div>
          </el-card>
<!--          <el-card-->
<!--          class="box-card"-->
<!--          body-style="height: inherit"-->
<!--          shadow="hover">-->
<!--            添加分类：-->
<!--            <el-divider></el-divider>-->
<!--            <el-form :inline="true" :model="categoryForm">-->
<!--              <el-form-item label="第一级">-->
<!--                <el-input v-model="categoryForm.first"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="第二级">-->
<!--                <el-input v-model="categoryForm.second"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="第三级">-->
<!--                <el-input v-model="categoryForm.third"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="第四级">-->
<!--                <el-input v-model="categoryForm.fourth"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item>-->
<!--                <el-button type="primary" @click="onSubmit()">提交</el-button>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </el-card>-->
        </el-col>
        <el-col :span="16">
          <el-card style="line-height:30px; color:#aaaaaa; text-align: center; font-size: 10px">
<!--            <span>点击放大，点击中间 [1:1], 拖动查看</span>-->
<!--            <el-image-->
<!--            :src="url"-->
<!--            :preview-src-list="[url]">-->
<!--          </el-image>-->
              <el-form ref="CFormRef" :rules="CFormRules"  :model="categoryForm">
                <el-form-item label="所属类别" prop="parentId">
                  <el-cascader
                      expand-trigger="hover"
                      :options="selectData"
                      style="width: 100%"
                      :props="{
                        value: 'id',
                        label: 'zh_name',
                      }"
                      change-on-select
                      clearable
                      v-model="categoryForm.parentId"
                      @change="handleChange">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="类别名称"  prop="zh_name">
                  <el-input v-model="categoryForm.zh_name"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="en_name">
                  <el-input v-model="categoryForm.en_name"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit()">提交</el-button>
                </el-form-item>
              </el-form>
            <p>注："所属类别" 为父级类别，若为根节点则无需选择</p>
<!--            <el-tree :data="selectData" :props="{-->
<!--                        value: 'id',-->
<!--                        label: 'zh_name',-->
<!--                      }"-->
<!--                     default-expand-all></el-tree>-->
            <div style="height: 500px" ref="category-chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {
  checkName,
  insertType,
  categoryTree,
  saveCategory, getDLtype
} from '../api/category'
import * as echarts from 'echarts';

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
        zh_name: '',
        en_name: '',
        parentId: null
      },
      CFormRules: {
        zh_name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ],
        en_name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      },
      categoryData: [],
        selectData: []
    }
  },
  created () {
  },
  methods: {
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
    initChart(data) {
      const categoryChart = this.$refs["category-chart"]
      const myChart = echarts.init(categoryChart);
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [data],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 9,
              formatter: function(params) {
                console.log(params)
              },
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      });
    },
    async onSubmit () {
      const that = this
      that.$refs.CFormRef.validate(async valid => {
        if (!valid) return
        saveCategory(this.categoryForm).then(res => {
          that.initData()
          if (res.status !== 200) {
            return that.$message.error('保存失败！')
          }
          return that.$message.success('保存成功！')
        })
      })
    },
    handleChange(value){
      this.categoryForm.parentId = value[value.length-1]
    },
    initData(){
      categoryTree().then(res=>{
        res.data.forEach(node => {
          this.formatData(node)
        })
        this.selectData = res.data
        this.initChart({
          name: '分类',
          children: this.selectData
        })
        console.log(this.selectData)
      })
      getDLtype().then(res=> {
        this.categoryData = res.data
      })
    },
    formatData(node){
      node.name = node.zh_name
      if (node.children.length === 0) delete node.children
      else {
        node.children.forEach(ch_node => {
          this.formatData(ch_node)
        })
      }
    }
  },
  mounted () {
    this.initData()
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
  .el-card__body{
    .dl-type-list{
      span {
        display: block;
      }
      .type-title {
        padding: 10px 0;
      }
      .type-item {
        padding: 5px;
        margin: 5px 0;
        background-color: #daf0f1;
      }
    }
  }
}

</style>
