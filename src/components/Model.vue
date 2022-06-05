<template>
    <div class="task">
        <el-card shadow="never">
            <div slot="header">
                <span>模型管理</span>
                <el-button
                        style="float: right; padding: 3px 0"
                        @click="creatingModle = true"
                        icon="el-icon-edit"
                        type="text"
                >创建模型
                </el-button>
            </div>
            <!-- 创建数据集 -->
            <el-form v-if="creatingModle" :model="CreatModelFrom" :inline="false" ref="CreatModelFromRef"
                     label-width="140px">
                <el-form-item
                        label="模型名称"
                        prop="modelName"
                        :rules="{
            required: true, message: '模型名称不能为空', trigger: 'blur'
          }"
                >
                    <el-input @focus="percentage = 0" v-model="CreatModelFrom.modelName" autocomplete="off"/>
                </el-form-item>

                <el-form-item label="运行系统"
                              prop="sysId"
                              :rules="{
            required: true, message: '运行系统不能为空', trigger: 'blur'
          }"
                >
                    <el-select v-model="CreatModelFrom.sysId" prop="sysId">
                        <el-option v-for="(item) in modelOptions" :key="item.sysId"
                                   :label="item.systemName +' '+ item.systemVersion" :value="item.sysId"/>
                    </el-select>
                </el-form-item>

                <br>
                <el-form-item label="训练类型" prop="dltype"
                              :rules="{
            required: true, message: '训练类型不能为空', trigger: 'blur'
          }">
                    <el-select v-model="CreatModelFrom.dltype">
                        <el-option v-for="(item, index) in fieldOptions" :key="index" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item
                        label="模型训练环境"
                        prop="runEnv"
                        :rules="{
            required: true, message: '训练环境说明不能为空', trigger: 'blur'
          }"
                >
                    <el-input maxlength="100" show-word-limit placeholder="请简要介绍模型运行环境！如：Tensorflow + Keras"
                              type="textarea"
                              v-model="CreatModelFrom.runEnv"/>
                </el-form-item>
                <el-form-item
                        label="模型说明"
                        prop="info"
                        :rules="{
            required: true, message: '模型说明不能为空', trigger: 'blur'
          }"
                >
                    <el-input maxlength="100" show-word-limit placeholder="请简要介绍模型！如：采用的神经网络以及操作对象。" type="textarea"
                              v-model="CreatModelFrom.info"/>
                </el-form-item>
                <br/>
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm('CreatModelFromRef')">立即创建</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
            <el-divider content-position="left">您创建的模型</el-divider>
            <el-card>
                <el-table
                        :data="modelData"
                        style="width: 100%">
                    <el-table-column
                            label="序号"
                            type="index"
                    >
                    </el-table-column>
                    <el-table-column
                            label="名称"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.modelName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="类型"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.dltype }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="创建时间"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="使用次数"
                            width="80px"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.useTimes }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="大小/ MB"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ Math.round(scope.row.storageSize/ 1024 /1024 * 100) / 100 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="模型说明"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.info }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                        <el-upload
                                v-show="props.row.fullPath === null"
                                ref="upload"
                                action="/model/upload"
                                accept="application/zip"
                                :limit=1
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-upload="beforeUpload"
                                :file-list="fileList"
                                :auto-upload="false"
                                :http-request="uploadFile">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload(props.row.modelId)">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传zip文件，<b>zip文件名中间不能包含空格，</b>且不超过1GB</div>
                            <el-progress style="margin-top: 10px" :percentage="percentage" :color="customColors"/>
                        </el-upload>
                        <!-- 进度条 -->
                        </template>
                    </el-table-column>

                </el-table>
            </el-card>
        </el-card>
    </div>
</template>

<script>
    // import { modelUpload } from '../assets/js/upload.js'
    import {insertModel, findAllByUserId, insertAndUpload} from '../api/model'
    import {getDLtype} from '../api/category'
    import {findSystem} from '../api/node'

    export default {
        data: function () {
            return {
                creatingModle: false,
                fileList: [],
                formData: new FormData(),
                // 表单
                CreatModelFrom: {
                    modelName: '',
                    dltype: '',
                    // modelParams: '',
                    sysId: '',
                    // params: [{
                    //   value: ''
                    // }],
                    runEnv: '',
                    info: '',
                    userId: ''
                },
                fieldOptions: {},
                modelOptions: {},
                // 表格数据
                modelData: [],
                // 创建进度
                percentage: 0,
                customColor: '#409eff',
                customColors: [
                    {color: '#f56c6c', percentage: 20},
                    {color: '#e6a23c', percentage: 40},
                    {color: '#5cb87a', percentage: 60},
                    {color: '#1989fa', percentage: 80},
                    {color: '#6f7ad3', percentage: 100}
                ]
            }
        },
        methods: {
            // 查询当前用户 model
            async findModelAll() {
                const that = this
                // 获取userid
                // const username = sessionStorage.getItem('username')
                // const resUserId = await this.$http.get('/user/byUsername/' + username)
                that.CreatModelFrom.userId = window.sessionStorage.getItem("userId")
                console.log(that.CreatModelFrom.userId)
                findAllByUserId(that.CreatModelFrom.userId).then(res => {
                    console.log(res.data)
                    if (res.status !== 200) {
                        return this.$message.error('暂时没有创建的模型，请创建...')
                    }
                    that.modelData = res.data
                })
            },
            findField() {
                const that = this
                getDLtype().then(res2 => {
                    if (res2.status !== 200) {
                        return this.$message.error('数据库连接失败！请检查...')
                    }
                    that.fieldOptions = res2.data
                    console.log(that.fieldOptions)
                })
            },
            findSystem() {
                const that = this
                findSystem().then(res => {
                    console.log(res.data)
                    if (res.status !== 200) {
                        return that.$message.error('数据库连接失败！请检查...')
                    }
                    const systems = res.data
                    console.log(systems)
                    that.modelOptions = systems
                })
            },
            // 表单
            submitForm(formName) {
                const that = this
                // const params = that.CreatModelFrom.params
                that.$refs[formName].validate(async valid => {
                    if (valid) {
                        insertModel(this.CreatModelFrom).then(res=>{
                            if(res.status !== 200) return that.$message.error('创建模型失败！...')
                            console.log(res)
                            this.creatingModle = false
                            // 刷新查询
                            that.findModelAll()
                            that.resetForm()
                        }).catch(err =>{
                            console.log(err)
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            resetForm() {
                this.$refs.CreatModelFromRef.resetFields()
                this.clearFiles()
            },
            // 上传
            uploadFile(file) {
                this.formData.append('file', file.file)
            },
            submitUpload(id) {
                const that = this
                const formDataTemp = that.formData
                that.$refs.upload.submit()
                if (formDataTemp.get('file') === null) return that.$message.error('请选择文件！！')
                formDataTemp.append("modelId",id);
                insertAndUpload(formDataTemp,
                    function (progressEvent) {
                        that.percentage = (progressEvent.loaded / progressEvent.total * 90 | 0)
                        console.log('上传 ' + that.percentage)
                    }
                ).then(res => {
                    console.log(res)
                    if (res.status !== 200) {
                        return that.$message.error('上传失败！请联系管理员')
                    } else {
                        that.percentage = 100
                        return that.$message.success('创建成功！')
                    }
                })
            },
            clearFiles() {
                this.$refs.upload.clearFiles()
            },
            beforeUpload(file) {
                if (file.size > 1024 * 1024 * 1024) {
                    this.$message.error('文件过大，支持1G以内文件。您的文件：' + Math.round((file.size / 1024 / 1024) * 100) / 100 + 'MB')
                    this.resetForm()
                    return false
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList)
            },
            handlePreview(file) {
                console.log(file)
                // console.log(this.fileList)
            },
    removeParam(item) {
        var index = this.CreatModelFrom.params.indexOf(item)
        if (index !== -1) {
            this.CreatModelFrom.params.splice(index, 1)
        }
    },
    addParam() {
        this.CreatModelFrom.params.push({
            value: '',
            key: Date.now()
        })
    },
        },
        mounted() {
            this.findModelAll()
            this.findField()
            this.findSystem()
        }
    }
</script>

<style lang='less' scoped>

    .task {
        // background-color: aquamarine;
        height: 100%;
    }
</style>
