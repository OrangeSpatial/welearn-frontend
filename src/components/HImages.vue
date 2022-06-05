<template>
    <div id="h-image">
<!--        <h1>影像展示页</h1>-->
        <!-- 数据集 -->
        <el-card>
            <el-row class="m-bottom">
                <el-col :span="7" :offset=0>
                    <el-card class="m-card-height" shadow="hover">
                        <!-- 数据集总量 -->
                        <div class="m-textcenter">
                            <span class="total">{{imageSettotal}}</span>
                            <span>  个</span>
                            <p class="subTitle">数据集总量</p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8" :offset=1>
                    <el-card class="m-card-height" shadow="hover">
                        <!-- 下载总量 -->
                        <div class="m-textcenter">
                            <span class="total">{{Math.round(imageTotal/10000)}}</span>
                            <span>  万</span>
                            <p class="subTitle">样本总量</p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7" :offset=1>
                    <el-card class="m-card-height" shadow="hover">
                        <!-- 存储总量 -->
                        <div class="m-textcenter">
                            <span class="total" >{{imagesStorageGB > 1024? Math.round(imagesStorageGB/1024*100)/100+"GB":imagesStorageGB+"MB"}}</span>
                            <p class="subTitle">存储总量</p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!--  ============== -->
            <div class="imageSetCategory">
                <div>
                    <i class="iconfont icon-moxingshixin"></i>
                    <div class="imageSetCategoryTitle">目标检测</div>
                    <span class="imageSetCategorySubTitle">目前该类型数据集有
            <span v-text="targetDetectionTotal"></span>
            个
          </span>
                </div>
                <router-link class="m-link" :to="{path:'/home/imageSet', query:{type:'目标检测'}}">更多>></router-link>
            </div>
            <el-row>
                <el-col class="m-bottom" :span="4" v-for="(item, index) in targetDetectionData" :key="item.imageSetId" :offset="(index%5 == 0) ? 0 : 1">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                        <el-link :underline="false" @click="dialogVisible=true, handleShow(item)">
                            <el-image fit="fill" class="thumbnail" :src="item.thumbnailUrl">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </el-link>
                        <div style="padding: 14px;">
                            <span class="m-fontSize">{{getImageName(item.imageSetName)}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ getCreateTime(item.createTime) }}</time>
                                <el-button type="text" @click="dialogVisible=true, handleShow(item)" class="checkInfo">查看详情</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!-- ========================= -->
            <div class="imageSetCategory">
                <div>
                    <i class="iconfont icon-moxingshixin"></i>
                    <div class="imageSetCategoryTitle">语义分割</div>
                    <span class="imageSetCategorySubTitle">目前该类型数据集有
            <span v-text="SemanticSegmentationTotal"></span>
            个
          </span>
                </div>
                <router-link class="m-link" :to="{path:'/home/imageSet', query:{type:'语义分割'}}">更多>></router-link>
            </div>
            <el-row>
                <el-col class="m-bottom" :span="4" v-for="(item, index) in SemanticSegmentationData" :key="item.imageSetId" :offset="(index%5 == 0) ? 0 : 1">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                        <el-link :underline="false" @click="dialogVisible=true, handleShow(item)">
                            <el-image fit="fill" class="thumbnail" :src="item.thumbnailUrl">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </el-link>
                        <div style="padding: 14px;">
                            <span class="m-fontSize">{{getImageName(item.imageSetName)}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ getCreateTime(item.createTime) }}</time>
                                <el-button type="text" class="checkInfo" @click="dialogVisible=true, handleShow(item)">查看详情</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!-- ========================= -->
            <div class="imageSetCategory">
                <div>
                    <i class="iconfont icon-moxingshixin"></i>
                    <div class="imageSetCategoryTitle">图像分类</div>
                    <span class="imageSetCategorySubTitle">目前该类型数据集有
            <span v-text="imageClassificationTotal"></span>
            个
          </span>
                </div>
                <router-link class="m-link" :to="{path:'/home/imageSet', query:{type:'图像分类'}}">更多>></router-link>
            </div>
            <el-row>
                <el-col class="m-bottom" :span="4" v-for="(item, index) in imageClassificationData" :key="item.imageSetId" :offset="(index%5 == 0) ? 0 : 1">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                        <el-link :underline="false" @click="dialogVisible=true, handleShow(item)">
                            <el-image fit="fill" class="thumbnail" :src="item.thumbnailUrl">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </el-link>
                        <div style="padding: 14px;">
                            <span class="m-fontSize">{{getImageName(item.imageSetName)}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ getCreateTime(item.createTime) }}</time>
                                <el-button type="text" class="checkInfo" @click="dialogVisible=true, handleShow(item)">查看详情</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <!-- detail -->
        <el-dialog
                :title="curImageSet.imageSetName"
                :visible.sync="dialogVisible"
                width="70%"
                :before-close="handleClose">
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-card class="imageInfo" shadow="hover">
                        <p><b class="tagInfo">来源：</b>{{curImageSet.dataSourceUrl}}</p>
                        <p><b class="tagInfo">创建时间：</b>{{curImageSet.createTime}}</p>
                        <p><b class="tagInfo">标签：</b>{{curImageSet.imageSetTag}}</p>
                        <p><b class="tagInfo">训练类别：</b>{{curImageSet.imageSetType}}</p>
                        <p><b class="tagInfo">分辨率：</b>{{curImageSet.resolution}}</p>
                        <p><b class="tagInfo">传感器：</b>{{curImageSet.sensor}}</p>
                        <p><b class="tagInfo">影像尺寸：</b>{{curImageSet.size}}</p>
                        <p><b class="tagInfo">坐标系：</b>{{curImageSet.srs}}</p>
                        <p><b class="tagInfo">数据类型：</b>{{curImageSet.type}}</p>
                        <p><b class="tagInfo">生产年份：</b>{{curImageSet.year}}</p>
                        <p><b class="tagInfo">大小：</b>{{Math.round(curImageSet.imageStorageSize/1024/1024*100)/100}}MB</p>
                        <p><b class="tagInfo">介绍：</b>{{curImageSet.imageSetInfo}}</p>
                    </el-card>
                </el-col>
                <el-col :span="8" class="image__lazy" >
                    <div id="imageShow">
                        <el-image v-for="url in notTifUrls" :key="url" :src="url" lazy></el-image>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-card class="labelList" shadow="hover">
                        <div v-for="item in curLabels" :key="item.labelStyle" >
                            <el-divider content-position="left">{{"标签类型："+item.labelStyle}}</el-divider>
                            <p v-for="la in item.labels" :key="la.labelId">{{la.labelName}}</p>
                        </div>
                    </el-card>
                    <p>该数据集共有{{curLabels.length}}个类别，{{labelStyles}}</p>
                    <el-divider></el-divider>
                    <el-button type="primary" size="small" @click="imagesDownLoad(curImageSet.imageSetId)">下载该数据集影像</el-button>
                    <el-button type="primary" size="small" @click="labelsDownLoad(curImageSet.imageSetId)">下载该数据集标签</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>


<script>

    import {getStatistic} from "../api/hello";
    import {findByType} from "../api/imageset"

    export default {
        data: function () {
            return {
                searchContent: '',
                select: '',
                currentDate: this.dateToString(new Date()),
                url: 'http://www.ceode.cas.cn/sjyhfw/ygtx/200903/W020090811549143957080.jpg',
                srcList: [
                    'http://www.ceode.cas.cn/sjyhfw/ygtx/200903/W020090811549009665175.jpg',
                    'http://www.ceode.cas.cn/sjyhfw/ygtx/200903/W020090811549095185075.jpg'
                ],
                tifImage: '../assets/img/rsImg.png',
                imageSetTotal: 0,
                imageTotal: 0,
                imagesStorageGB: 46,
                targetDetectionData: [],
                targetDetectionTotal: 0,
                SemanticSegmentationData: [],
                SemanticSegmentationTotal: 0,
                imageClassificationData: [],
                imageClassificationTotal: 0,
                dialogVisible: false,
                curImageSet: '',
                notTifUrls: [],
                curLabels: [],
                labelStyles: '',
                // model
                modelData: [],
                filterModelByType: [
                    { text: '目标检测', value: '目标检测' },
                    { text: '语义分割', value: '语义分割' },
                    { text: '图像分类', value: '图像分类' }
                ],
                filterDate: [],
                categoryType: ''
            }
        },
        methods: {
            dateToString (date) {
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var day = date.getDate()
                return year + '-' + month + '-' + day
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
            },
            getCreateTime (stringTime) {
                return stringTime.split(' ')[0]
            },
            getImageName (name) {
                if (name.length < 10) return name
                return name.substring(0, 10) + '...'
            },
            async findImageSet () {
                findByType('目标检测' + '/5').then(res=>{
                    if (res.status !== 200) {
                        return this.$message.error('访问错误！')
                    }
                    this.targetDetectionData = res.data
                    this.targetDetectionTotal = res.data.length
                })

                findByType('语义分割' + '/5').then(res1=>{
                    console.log(res1.data)
                    if (res1.status !== 200) {
                        return this.$message.error('访问错误！')
                    }
                    this.SemanticSegmentationData = res1.data
                    this.SemanticSegmentationTotal = res1.data.length
                })

                findByType('图像分类' + '/5').then(res2=>{
                    console.log(res2.data)
                    if (res2.status !== 200) {
                        return this.$message.error('访问错误！')
                    }
                    this.imageClassificationData = res2.data
                    this.imageClassificationTotal = res2.data.length
                })

                const res3 = await this.$http.get('/model/findAll')
                console.log(res3.data)
                if (res3.status !== 200) {
                    return this.$message.error('访问错误！')
                }
                this.modelData = res3.data
            },
            async handleShow (row) {
                this.curImageSet = row
                console.log(this.curImageSet)
                const res = await this.$http.get('/image/getImageUrls/' + row.imageSetId)
                if (res.status !== 200) return this.$message.error('获取失败！')
                console.log(res.data)
                if (res.data.type === null || res.data.urls === null) {
                    document.getElementById('imageShow').innerHTML = ''
                } else {
                    this.downSetId = row.imageSetId
                    this.notTifUrls = res.data
                }
                const res1 = await this.$http.get('/label/getLabelNameAndStyles/' + row.imageSetId)
                if (res1.status !== 200) return this.$message.error('获取失败！')
                console.log(res1)
                this.curLabels = res1.data
                this.curLabels.forEach((label, index) => {
                    if (index === this.curLabels.length - 1) {
                        this.labelStyles += label.labelStyle
                    } else {
                        this.labelStyles += label.labelStyle + '，'
                    }
                })
            },
            handleClose () {
                this.dialogVisible = false
                this.curImageSet = ''
                this.labelStyles = ''
                this.curLabels = []
            },
            resetDateFilter () {
                this.$refs.filterTable.clearFilter('date')
            },
            clearFilter () {
                this.$refs.filterTable.clearFilter()
            },
            filterTag (value, row) {
                return row.dltype === value
            },
            async imagesDownLoad (imageSetId) {
                const conf = {
                    responseType: 'blob'
                }
                await this.$http.get('/image/zip/' + imageSetId, conf).then(response => {
                    const blob = new Blob([response.data], { type: 'application/zip' })
                    const url = window.URL.createObjectURL(blob)
                    window.location.href = url
                    return this.$message.success('下载完成')
                })
            },
            async labelsDownLoad (imageSetId) {
                if (this.curLabels.length === 0) return this.$message.error('该数据集无标签！')
                const conf = {
                    responseType: 'blob'
                }
                await this.$http.get('/label/zip/' + imageSetId, conf).then(response => {
                    const blob = new Blob([response.data], { type: 'application/zip' })
                    const url = window.URL.createObjectURL(blob)
                    window.location.href = url
                    return this.$message.success('下载完成')
                })
            }
        },
        mounted () {
            this.findImageSet();
            this.getImageSet();
        }
    }
</script>



<style lang="less" scoped>
#h-image{
    /*text-align: center;*/
    .el-card {
        color: white;
        background-color: #13203B;
        border: none;
    }

    .image{
        width: 100%;
        display: block;
    }

    .checkInfo{
        padding: 0;
        float: right;
    }
    .time {
        font-size: 13px;
        color: #999;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .m-flex{
        display: flex;
        justify-content: space-between;
    }

    .box-card{
        margin-top: 5px;
    }

    .m-bottom{
        margin-bottom: 10px;
    }

    .m-card-height{
        height: 130px;
        // line-height: 100px;
    }
    .m-boxcenter{
        display: flex;
        justify-content: space-between;
        // padding: 0 30px;
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // transform:translate(-50%,-50%);
    }
    .m-textcenter{
        padding-top: 10px;
        text-align: center;
    }
    .total{
        font-size: 40px;
        color: rgba(238, 237, 0, 0.9);
    }
    .subTitle{
        color: white;
    }
    .imageSetCategory{
        height: 30px;
        margin: 50px 0 15px 0;
        border-bottom: 1px rgb(185, 185, 185) solid;
        // background-color: hotpink;
        color: rgb(88, 236, 247);
        display: flex;
        justify-content: space-between;
    }
    .imageSetCategoryTitle{
        display: inline;
    }
    .imageSetCategorySubTitle{
        color: gray;
        padding-left: 20px;
        font-size: 10px;
    }
    .el-link,.el-link--inner{
        text-align: center;
        display: inline-block;
        vertical-align: middle;
        width: 100%;
    }
    .thumbnail{
        height: 150px;
        line-height: 150px;
        width: 100%;
        padding: 0px;
        border-bottom: 1px hotpink solid;
    }
    .el-image{
        width: 100%;
        border-radius: 5px 5px;
    }
    .m-fontSize{
        color: #666;
        font-size: 12px;
    }
    .clearButton{
        width: 100%;
        border: none;
        border-bottom: 1px hotpink solid;
    }
    .image__lazy{
        overflow: scroll;
        height: 450px;
    }
    .labelList{
        overflow: scroll;
        height: 250px;
    }
    .tagInfo{
        color: rgb(25, 117, 221);
    }
    .m-link{
        color: rgb(59, 172, 247) !important;
        text-decoration: none;
    }
}

</style>
