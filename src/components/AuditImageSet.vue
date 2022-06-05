<template>
    <div id="auditImageSet">
        <el-card shadow="never">
            <div slot="header">
                <span>数据集审核</span>
                <el-button style="float: right; padding: 3px 0" icon="el-icon-edit" type="text">编辑</el-button>
            </div>
            <div class="imageSetBox">
                <el-table
                        :data="imageSetData"
                        @expand-change="change"
                        row-key="imageSetId"
                        :expand-row-keys="expandRow"
                        style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-row>
                                <el-col :span="10">
                                    <el-form label-width="150px" label-position="right" class="detail">
                                        <el-form-item label="数据来源">
                                            <span>{{ props.row.dataSourceUrl }}</span>
                                        </el-form-item>
                                        <el-form-item label="影像数量">
                                            <span>{{ props.row.imageCount }}</span>
                                        </el-form-item>
                                        <el-form-item label="影像大小">
                                            <span>{{ props.row.imageStorageSize }}</span>
                                        </el-form-item>
                                        <el-form-item label="标签大小">
                                            <span>{{ props.row.labelStorageSize }}</span>
                                        </el-form-item>
                                        <el-form-item label="是否开放">
                                            <span>{{ props.row.open }}</span>
                                        </el-form-item>
                                        <el-form-item label="传感器">
                                            <span>{{ props.row.sensor }}</span>
                                        </el-form-item>
                                        <el-form-item label="遥感影像分辨率">
                                            <span>{{ props.row.resolution }}</span>
                                        </el-form-item>
                                        <el-form-item label="影像年份">
                                            <span>{{ props.row.year }}</span>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="9">
                                    <el-card class="imageBox" shadow="never">
                                        <el-image v-for="url in tempImagUrls" :key="url" :src="url" lazy/>
                                    </el-card>
                                </el-col>
                                <el-col :span="5">
                                    <el-card class="imageBox" shadow="never">
                                        <div v-for="label in tempLabels" :key="label.labelStyle">
                                            <p style="font-weight: bold; display: inline-block; width: 100%; border-bottom: 1px solid gray">{{label.labelStyle}}</p>
                                            <p style="font-style: italic" v-for="item in label.labels" :key="item.labelId">{{item.labelName}}</p>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div class="auditBox">
                                <el-input v-model="auditContent" placeholder="请输入审核意见"/>
                                <div class="auditButtons">
                                    <el-button type="primary" @click="audit(props.row.imageSetId, 1)">审核通过</el-button>
                                    <el-button type="danger" @click="audit(props.row.imageSetId, 0)">审核不通过</el-button>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="数据集名称"
                            prop="imageSetName">
                    </el-table-column>
                    <el-table-column
                            label="训练类型"
                            prop="imageSetType">
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            prop="createTime">
                    </el-table-column>
                    <el-table-column
                            label="创建用户"
                            prop="user.username">
                    </el-table-column>
                    <el-table-column
                            label="描述"
                            prop="imageSetInfo">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    import { findAllByAudit, audit } from "../api/imageset";
    import { getImageUrlsBySetId } from "../api/image"
    import { getLabelNameBySetId } from "../api/label"
    export default {
        data () {
            return {
                imageSetData: [],
                tempImagUrls: [],
                expandRow: [],
                tempLabels: [],
                LabelProps: {
                    labelStyle: '标签类型',
                    labels: '标签名'
                },
                auditContent: ''
            }
        },
        mounted () {
            this.getImageSetsNotAudit()
        },
        computed: {
        },
        methods: {
            getImageSetsNotAudit(){
                findAllByAudit(0).then(res=>{
                    if(res.status !== 200 )return this.$message.error("请检查网络！！")
                    console.log(res.data)
                    this.imageSetData = res.data
                })
                // console.log(this.getImagesByImageSetId("4028e619737544f501737576b3b90064"))
            },
            change(row ){
                if(row.imageSetId === this.expandRow[0]){
                    this.expandRow = []
                }else {
                    this.expandRow = []
                    this.expandRow.push(row.imageSetId)
                    this.tempImagUrls = []
                    getImageUrlsBySetId(row.imageSetId).then(res=>{
                        this.tempImagUrls = res.data
                        // console.log(this.tempImagUrls)
                    })
                    this.tempLabels = []
                    getLabelNameBySetId(row.imageSetId).then(res=>{
                        this.tempLabels = res.data
                        console.log(this.tempLabels)
                    })
                }
            },
            audit(id, isAudit){
                console.log(this.auditContent)
                console.log(id, isAudit)
                if(this.auditContent === "") return this.$message.warning("请输入审核内容...")
                audit({
                    imageSetId: id,
                    auditStatus: isAudit,
                    auditContent: this.auditContent
                }).then(res=>{
                    if(res.status !== 200) return this.$message.error("审核失败")
                    this.getImageSetsNotAudit()
                    return this.$message.success("审核成功！")
                })
            }
        }
    }
</script>

<style lang='less' scoped>

    #auditImageSet{
        // background-color: aquamarine;
        height: 100%;
        .imageSetBox{
            .detail{
                background-color: #f1f4f7;
                padding: 10px 0 1px;
                border-radius: 5px;
                .el-form-item{
                    span{
                        color: #DD4A68;
                    }
                }
            }
            .imageBox{
                border-radius: 0;
                border: none;
                height: 500px;
                overflow-y: scroll
            }
            .imageBox::-webkit-scrollbar {
                width: 6px;
            }
            .imageBox::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: #aaaaaa;
            }
            .auditBox{
                margin: 10px 0;
                .auditButtons{
                    margin-top: 10px;
                    display: flex;
                }
            }
        }
    }

</style>
