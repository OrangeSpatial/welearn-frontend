<template>
    <div id="h-model">
        <!-- 模型 -->
        <el-card class="box-card">
<!--            <div slot="header" class="clearfix">-->
<!--                <span>模型仓库</span>-->
<!--                <el-input placeholder="请输入内容" :clearable="true" size="small"-->
<!--                          style="width: 300px; float: right; padding: 3px 0"-->
<!--                          v-model="searchContent">-->
<!--                    <el-button slot="append" icon="el-icon-search"></el-button>-->
<!--                </el-input>-->
<!--            </div>-->
            <el-card :body-style="{ padding: '0px' }">
                <div class="m-boxcenter">
                    <el-button class="clearButton" @click="resetDateFilter">清除日期过滤器</el-button>
                    <el-button class="clearButton" @click="clearFilter">清除所有过滤器</el-button>
                </div>
                <el-table
                        ref="filterTable"
                        :data="modelData"
                        style="width: 100%">
                    <el-table-column
                            prop="index"
                            label="序号"
                            type="index"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="modelName"
                            label="名称"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.modelName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="dltype"
                            label="类型"
                            :filters="filterModelByType"
                            :filter-method="filterTag"
                            filter-placement="bottom-end"
                    >
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.dltype === '目标检测' ? 'primary' : (scope.row.dltype === '语义分割' ?'success':'warning')"
                                    disable-transitions>{{scope.row.dltype}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="updateTime"
                            label="创建时间"
                            sortable
                            column-key="date"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="useTimes"
                            label="使用次数"
                            width="80px"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.useTimes }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="storageSize"
                            label="大小/ MB"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ Math.round(scope.row.storageSize/ 1024 /1024 * 100) / 100 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="info"
                            label="模型说明"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.info }}</span>
                        </template>
                    </el-table-column>

                </el-table>
            </el-card>
        </el-card>
    </div>
</template>


<script>

    import {getStatistic} from "../api/hello";
    import {findAll} from "../api/model";

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
                findAll().then(res3=>{
                    console.log(res3.data)
                    if (res3.status !== 200) {
                        return this.$message.error('访问错误！')
                    }
                    this.modelData = res3.data
                })
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
#h-model{
    .el-card {
        color: white;
        background-color: #13203B;
        border: none;
    }
    .el-table{
        background-color: #13203B;
        color: white;
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
