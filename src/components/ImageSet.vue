<template>
    <div class="data">
        <el-card>
            <div slot="header">
                <span>数据管理</span>
                <el-button
                        style="float: right; padding: 3px 0"
                        @click="dialogFormVisible = true"
                        icon="el-icon-edit"
                        type="text"
                >创建数据集
                </el-button>
            </div>
            <!-- 创建表单 -->
            <el-dialog title="创建影像集" width="55%" @close="resetForm()" :visible.sync="dialogFormVisible">
                <el-card shadow="always">
                    <!-- 创建数据集 -->
                    <el-form
                            ref="CreatSetFormRef"
                            :model="CreatSetFrom"
                            :inline="false"
                            :rules="setFormRules"
                            label-width="120px"
                    >
                        <el-form-item label="影像集名称" prop="imageSetName">
                            <el-input v-model="CreatSetFrom.imageSetName" autocomplete="off"/>
                        </el-form-item>
                        <el-form-item label="训练领域" prop="imageSetType">
                            <el-select v-model="CreatSetFrom.imageSetType">
                                <el-option
                                        v-for="(item, index) in fieldOptions"
                                        :key="index"
                                        :label="item"
                                        :value="item"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据集来源链接" prop="dataSourceUrl">
                            <el-input placeholder="开源数据集请输入开源url，其他选输入‘自建’"
                                      v-model="CreatSetFrom.dataSourceUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="数据年份" prop="year">
                            <el-input placeholder="请输入年份" v-model="CreatSetFrom.year"></el-input>
                        </el-form-item>
                        <el-form-item label="影像分辨率" prop="resolution">
                            <el-input placeholder="请输入分辨率，如：30m" v-model="CreatSetFrom.resolution"></el-input>
                        </el-form-item>
                        <el-form-item label="尺寸大小" prop="size">
                            <el-input placeholder="请输入尺寸，如：25×25" v-model="CreatSetFrom.size"></el-input>
                        </el-form-item>
                        <el-form-item label="影像坐标系" prop="srs">
                            <el-input placeholder="若有地理坐标系，请填写" v-model="CreatSetFrom.srs"></el-input>
                        </el-form-item>
                        <el-form-item label="影像传感器" prop="sensor">
                            <el-input placeholder="请输入影像传感器" v-model="CreatSetFrom.sensor"></el-input>
                        </el-form-item>
                        <el-form-item label="数据集介绍" prop="imageSetInfo">
                            <el-input
                                    maxlength="200"
                                    placeholder="请简要介绍数据集, 不要超过200个汉字！"
                                    show-word-limit
                                    type="textarea"
                                    v-model="CreatSetFrom.imageSetInfo"
                            />
                        </el-form-item>
                        <br/>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">立即创建</el-button>
                            <el-button @click="resetForm()">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-dialog>

            <!-- wwwwwwwwww -->
            <el-divider content-position="left">您创建的数据集</el-divider>
            <!-- 数据集 start-->
            <el-card>
                <el-table :data="setInfoData" style="width: 100%">
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column label="id" v-if="show = false">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.imageSetId }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" width="200px">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.imageSetName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="训练领域" width="100px">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.imageSetType }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="来源">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.dataSourceUrl }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="200px">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据集状态" width="100px">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="left">
                                <p>审核意见: {{ scope.row.auditContent === null ? "该数据及还未审核！" : scope.row.auditContent}}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag :type="scope.row.auditStatus=== false ?'danger':'success'">{{ (scope.row.auditStatus === false) ? "未审核":"已审核" }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="400px">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-upload2"
                                    @click="dialogImageUploadVisible = true, handleImageEdit(scope.$index, scope.row)"
                            >上传影像
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-upload2"
                                    @click="dialogLabelUploadVisible = true, handleLabelEdit(scope.$index, scope.row)"
                            >上传标签
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-more"
                                    @click="dialogShowFormVisible =true, handleShow(scope.row)"
                            >详情
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="delImageSet(scope.row.imageSetId)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-card>
        <!-- 创建样本 -->
        <div id="createSimpleContainer" v-if="creating">
            <el-card
                    style="margin-bottom:15px;border:none;border-bottom:1px solid rgb(231, 231, 231);"
                    shadow="never"
            >创建样本集
            </el-card>
            <el-form :model="simple" ref="simpleRef" label-width="90px">
                <el-form-item
                        label="样本名称"
                        prop="simpleName"
                        :rules="[
                    { required: true, message: '样本名称不能为空'}
                  ]"
                >
                    <el-input placeholder="请输入样本名称" v-model="simple.simpleName"></el-input>
                </el-form-item>
                <el-form-item
                        label="训练类型"
                        :rules="[
                    { required: true, message: '训练类型必须选择不能为空'}
                  ]"
                >
                    <el-radio-group v-model="simple.dlType">
                        <el-radio
                                v-for="(item, index) in fieldOptions"
                                :key="index"
                                :label="item"
                                @change="findImageSets"
                                border
                        >{{item}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择数据集">
                    <el-table
                            ref="multipleTable"
                            :data="imageSetsForSelection"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="数据集名称" prop="imageSetName" width="120"></el-table-column>
                        <el-table-column prop="imageSetType" label="训练领域" width="120"></el-table-column>
                        <el-table-column prop="dataSourceUrl" label="来源" show-overflow-tooltip></el-table-column>
                        <el-table-column label="创建时间" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="success"
                                        icon="el-icon-more"
                                        @click="dialogShowFormVisible =true, handleShow(scope.row)"
                                >详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createSimple()">立即创建</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 展示样本集 -->
        <el-card id="simpleMangement" shadow="always">
            <div slot="header">
                <span>样本管理</span>
                <el-button
                        style="float: right; padding: 3px 0"
                        @click="creating = true"
                        icon="el-icon-edit"
                        type="text"
                >创建样本集
                </el-button>
            </div>
            <el-card v-if="simplesData.length === 0" shadow="none" style="border:none">
                <div style="text-align:center;color:gray">暂无样本集</div>
            </el-card>
            <el-card shadow="never" v-for="(item,index) in simplesData"
                     :class="[index === simplesData.length-1? '':'m-margin-bottom']" :key="item.simpleId">
                <el-row type="flex" justify="space-between">
                    <el-col :span="2">
                        <div class="simpleName">{{item.simpleName}}</div>
                    </el-col>
                    <el-col :span="10">
                        <el-row>
                            <el-col
                                    :span="Math.floor(24/item.imageSets.length)"
                                    v-for="imageSet in item.imageSets"
                                    :key="imageSet.imageSetId"
                            >
                                <el-card class="imageSet" :body-style="{ padding: '0px' }" shadow="hover">
                                    <!-- <img :src="imageSet.thumbnailUrl" class="imageSetThumb" /> -->
                                    <el-image
                                            @click="dialogShowFormVisible =true,handleShow(imageSet)"
                                            :src="imageSet.thumbnailUrl"
                                            fit="cover"
                                    >
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline"/>
                                        </div>
                                    </el-image>
                                    <div @click="dialogShowFormVisible =true,handleShow(imageSet)"
                                         class="imageSetTitle">{{imageSet.imageSetName}}
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                        <!-- <div >
                        </div>-->
                    </el-col>
<!--                    增强-->
                    <el-col :span="4">
                        <el-card class="imageSetHeighten" :body-style="{ padding: '0px' }" shadow="hover">
                            <!-- <img :src="imageSet.thumbnailUrl" class="imageSetThumb" /> -->
                            <el-image
                                    @click="dialogShowFormVisible =true,handleShow(item.enhancedImageSet)"
                                    :src="item.enhancedImageSet === null ? '':item.enhancedImageSet.thumbnailUrl"
                                    fit="cover"
                            >
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"/>
                                </div>
                            </el-image>
                            <div @click="dialogShowFormVisible =true,handleShow(item.enhancedImageSet)" class="imageSetTitle">
                                {{item.enhancedImageSet === null ? '暂无增强数据集':item.enhancedImageSet.imageSetName}}
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="2">
                        <div class="simplehandle">
                            <el-button @click="delSimple(item.simpleId)" type="danger" icon="el-icon-delete" circle/>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-card>
        <!-- 上传影像 -->
        <el-dialog
                width="40%"
                :show-close="false"
                @closed="clearImageUpload"
                :title = "imageSetName"
                :visible.sync="dialogImageUploadVisible"
        >
            <el-card class="card-height" shadow="hover">
                <!-- 上传影像 -->
                <div class="upload-title">
                    <i class="el-icon-picture-outline"/>
                    影像上传
                </div>
                <p>请选择您影像所在类别，若不存在小类别，请手动填写：</p>
                <el-select v-model="type.first" @change="getSeconds(type.first)" placeholder="第一级">
                    <el-option v-for="(item, index) in firstOptions" :key="index" :label="item"
                               :value="item"/>
                </el-select>
                <el-select
                        v-model="type.second"
                        @change="getThirds(type.first,type.second)"
                        placeholder="请先选择第一级"
                >
                    <el-option
                            v-for="(item, index) in secondOptions"
                            :key="index"
                            :label="item"
                            :value="item"
                    />
                </el-select>
                <el-select v-model="type.third" @change="getAlltag()" placeholder="请先选择第二级">
                    <el-option v-for="(item, index) in thirdOptions" :key="index" :label="item"
                               :value="item"/>
                </el-select>
                <el-input v-model="usersTag" placeholder="请输入您上传影像中公有的类别，如：道路、建筑物等"/>
                <el-button class="m-margin" size="small" type="primary" @click="imageChooseFiles">选择影像文件夹</el-button>
                <div v-show="false">
                    <input
                            type="file"
                            id="imageFile"
                            ref="file"
                            webkitdirectory
                            directory
                            multiple="multiple"
                            @change="handleImageUpload($event)"
                    />
                </div>
                <div>
                    <p class="uploadTip">请确保您上传文件夹中，<b>影像名中间无空格，</b>只有图像文件(jpg/png/tif/tiff/bmp)</p>
                </div>
                <p class="uploadTip inputFileNum" v-text="imageLoadedFiles"></p>
                <div class="progressPosition">
                    <el-progress :percentage="imagePercentage"/>
                </div>
            </el-card>
        </el-dialog>
        <!-- 上传标签 -->
        <el-dialog width="40%" @closed="clearLabelUpload" :title="imageSetName" :visible.sync="dialogLabelUploadVisible">
            <el-card class="card-height" shadow="hover">
                <!-- 上传label -->
                <div class="upload-title">
                    <i class="el-icon-paperclip"></i>
                    标签上传(请确保标签名与影像名有一定关联度)
                </div>
                <el-select class="m-margin" v-model="labelStyle" placeholder="请选择标签类别">
                    <el-option v-for="(item, index) in labelStyles" :key="index" :label="item"
                               :value="item"/>
                </el-select>
                <el-input v-model="labeledObject" placeholder="请输入标注对象（标签所标注影像中的对象）"/>
                <el-button
                        class="m-margin"
                        size="small"
                        type="primary"
                        @click="labelChooseFiles"
                >选择所选标签类别文件夹
                </el-button>
                <div v-show="false">
                    <input
                            type="file"
                            id="labelFile"
                            ref="file"
                            webkitdirectory
                            directory
                            multiple="multiple"
                            @change="handleLabelUpload($event)"
                    />
                </div>
                <div>
                    <p class="uploadTip">请确保您上传文件夹中，<b>标签名中间无空格</b>，标签格式只有一种(png/tif/txt/xml/yaml/mat/json)</p>
                </div>
                <p class="uploadTip inputFileNum" v-text="labelLoadedFiles"/>
                <div class="progressPosition">
                    <el-progress :percentage="labelPercentage" />
                </div>
            </el-card>
        </el-dialog>
        <!-- 展示数据 -->
        <el-dialog
                :title="imageSetName"
                width="55%"
                @closed="closeShow"
                :destroy-on-close="true"
                :visible.sync="dialogShowFormVisible"
        >
            <el-row :gutter="12">
                <el-col :span="16" class="image__lazy">
                    <div id="imageShow">
                        <el-image v-for="url in notTifUrls" :key="url" :src="url" lazy/>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-card class="imageInfo" shadow="hover">
                        数据集介绍
                        <el-divider/>
                        <p>大小：{{getMB(imageStorageSize)}}MB</p>
                        <p>介绍：{{imageSetInfo}}</p>
                    </el-card>
                    <el-button type="primary" size="small" @click="handleDownLoad(downSetId)">下载该数据集</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 上传提示 -->
        <el-dialog title="提示" width="55%" :destroy-on-close="true" :visible.sync="dialogTipVisible">
            <h3>影像:{{existImageList[0].imageName}}，大小{{getMB(existImageList[0].imageStorageSize)}}MB，已存在，请检查！</h3>
        </el-dialog>
        <!-- 标签上传提示 -->
        <el-dialog title="提示" width="55%" :destroy-on-close="true" :visible.sync="dialogTipVisible1">
            <h3>标签:{{existLabelList[0].imageName}}，已存在，请检查！</h3>
        </el-dialog>
        <!-- 样本删除提示 -->
        <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
            <span>确定要删除您创建样本集吗？您所增强的样本也会删除！</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false, handleDel()">确 定</el-button>
      </span>
        </el-dialog>
        <!-- 数据集删除提示 -->
        <el-dialog title="提示" :visible.sync="deleteImageSetDialogVisible" width="40%" center>
            <span>确定要删除该数据集吗？这将会删除给数据集下的标签和影像！</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="deleteImageSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteImageSetDialogVisible = false, handleDelImageSet()">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getUserByName} from "../api/user";
    import {getByUser, insert, findImageSet, delImageSet} from "../api/imageset";
    import {
        findFirst,
        findSecondByFirst,
        findThirdByFirstAndSecond
    } from "../api/category";
    import {getImageUrlsBySetId, DownloadImage, uploadImage} from "../api/image";
    import {uploadLabel} from "../api/label";
    import {insertSimple, findSimpleByUser, delSimpleById} from "../api/simple";

    export default {
        data: function () {
            return {
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogImageUploadVisible: false,
                dialogLabelUploadVisible: false,
                dialogShowFormVisible: false,
                dialogTipVisible: false,
                dialogTipVisible1: false,
                deleteDialogVisible: false,
                deleteImageSetDialogVisible: false,
                setInfoData: [],
                type: {
                    first: "",
                    second: "",
                    third: ""
                },
                CreatSetFrom: {
                    imageSetName: "",
                    imageSetType: "",
                    imageSetInfo: "",
                    imageDownTimes: 0,
                    imageStorageSize: 0,
                    labelStorageSize: 0,
                    userId: "",
                    dataSourceUrl: "",
                    resolution: "",
                    srs: "",
                    size: "",
                    year: "",
                    sensor: ""
                },
                setFormRules: {
                    imageSetName: [
                        {required: true, message: "请输入数据集名称", trigger: "blur"}
                    ],
                    imageSetType: [
                        {required: true, message: "请选择训练领域", trigger: "blur"}
                    ],
                    imageSetInfo: [
                        {
                            required: true,
                            message: "请简要介绍数据集, 不要超过200汉字！",
                            trigger: "blur"
                        }
                    ]
                },
                delImageSetId: '',
                upLoadform: {},
                // 类别
                firstOptions: {},
                fieldOptions: {},
                secondOptions: {},
                thirdOptions: {},
                fourthOptions: {},
                // 绑定Id
                imageSetId: "",
                // imageSetName: "",
                // progress status
                progressStatus: ["success", "warning", "exception"],
                // =====上传image
                imageSetTag: "",
                usersTag: "",
                imageList: "",
                imageLoadedFiles: "未选择任何文件",
                imagePercentage: 0,
                imageStatus: "",
                userId: "",
                existImageList: [{imageName: "", imageStorageSize: 0}],
                // fileList1: [],
                // imageFormData: new FormData(),
                // imageType: 'image/bmp,image/jpeg,image/png,image/tiff',
                // =====上传label
                labelList: "",
                labelLoadedFiles: "未选择任何文件",
                labelPercentage: 0,
                labelStatus: "success",
                existLabelList: [{labelName: ""}],
                // fileList2: [],
                // labelFormData: new FormData(),
                labelType: "application/xml, .txt, .yaml, image/png",
                labelStyles: ["mask", "other"],
                labelStyle: "",
                labeledObject: "",
                // 展示
                // fastdfs: {
                //   group1: '192.168.30.92',
                //   group2: '192.168.30.94'
                // },
                imageSetName: "",
                imageSetInfo: "",
                imageStorageSize: 0,
                // 下载
                downSetId: "",
                notTifUrls: [],
                imageSetData: [],
                imageTifs: [],
                i: 0,
                j: 0,
                // simple=============
                simple: {
                    simpleName: "",
                    dlType: "",
                    imageSets: [],
                    userId: ""
                },
                imageSetsForSelection: [],
                creating: false,
                imageSetUrl:
                    "http://192.168.3.22:9000/imagesets/402883927352f097017352fb69ee0000/images/NIR_19.jpg",
                simplesData: [],
                delSimpleId: ''
            };
        },
        methods: {
            findSetAll() {
                const that = this;
                const username = sessionStorage.getItem("username");
                getUserByName(username).then(res => {
                    if (res.status === 200) {
                        this.CreatSetFrom.user = res.data;
                        this.CreatSetFrom.userId = res.data.userId;
                        this.userId = res.data.userId;
                        this.findSimples(this.userId);
                        console.log(username + "===" + res.data.userId);
                        // await this.$http.get('/imageSet/findall')
                        getByUser(res.data.userId).then(resp => {
                            console.log(resp);
                            if (resp.status !== 200) {
                                return this.$message.error("您当前未创建数据集，请创建...");
                            }
                            that.setInfoData = resp.data;
                        });
                    }
                });
            },
            createSet() {
                const that = this;
                that.firstOptions = [];
                findFirst().then(res => {
                    console.log(res.data);
                    if (res.status !== 200) {
                        return this.$message.error("数据库连接失败！请检查...");
                    }
                    that.firstOptions = res.data.firsts;
                    that.type.second = "";
                    that.fieldOptions = res.data.dlTypes;
                    // console.log(that.firstOptions)
                });
            },
            getSeconds(first) {
                const that = this;
                this.imageSetTag = first;
                console.log(this.imageSetTag);
                if (first === "") return;
                findSecondByFirst(first).then(res => {
                    console.log(res);
                    if (res.status !== 200) {
                        return this.$message.error("数据库连接失败！请检查...");
                    }
                    that.secondOptions = res.data;
                    that.type.second = "";
                    that.type.third = "";
                    // console.log(that.secondOptions)
                });
            },
            getThirds(first, second) {
                const that = this;
                this.imageSetTag += "," + second;
                console.log(this.imageSetTag);
                if (second === "") return;
                findThirdByFirstAndSecond(first, second).then(res => {
                    console.log(res.data);
                    if (res.status !== 200) {
                        return this.$message.error("数据库连接失败！请检查...");
                    }
                    that.thirdOptions = res.data;
                    that.type.third = "";
                    // console.log(that.thirdOptions)
                });
            },
            getAlltag() {
                const that = this;
                const first = that.type.first;
                const second = that.type.second;
                const third = that.type.third;
                if (third === "") {
                    return;
                } else {
                    this.imageSetTag = first + "," + second + "," + third;
                }
                console.log(this.imageSetTag);
            },
            resetForm() {
                this.$nextTick(() => {
                    this.$refs.CreatSetFormRef.resetFields();
                });
                this.CreatSetFrom.imageSetType = "";
            },
            submitForm() {
                const that = this;
                this.$refs.CreatSetFormRef.validate(async valid => {
                    if (valid) {
                        insert(that.CreatSetFrom).then(res => {
                            console.log(res);
                            if (res.status !== 200) {
                                return this.$message.error("创建失败！请联系管理员");
                            }
                            that.resetForm();
                            that.dialogFormVisible = false;
                            that.findSetAll();
                            return this.$message.success("创建成功！");
                        });
                    } else {
                        // console.log('error submit!!')
                        return false;
                    }
                });
            },
            handleImageEdit(index, row) {
                console.log(index, row.imageSetId);
                this.imageSetId = row.imageSetId;
                this.imageSetName = row.imageSetName;
                this.createSet();
            },
            handleLabelEdit(index, row) {
                console.log(index, row.imageSetId);
                this.imageSetId = row.imageSetId;
            },
            handleShow(row) {
                this.imageSetInfo = row.imageSetInfo;
                this.imageStorageSize = row.imageStorageSize;
                console.log(row.imageStorageSize);
                getImageUrlsBySetId(row.imageSetId).then(res => {
                    console.log(res);
                    if (res.status === 204)
                        return this.$message.error("该数据集当前无数据！");
                    if (res.status === 200) {
                        this.downSetId = row.imageSetId;
                        this.notTifUrls = res.data;
                        this.findSetAll();
                    }
                });
            },
            handleDownLoad(imageSetId) {
                const link = document.createElement("a");
                DownloadImage(imageSetId).then(response => {
                    const blob = new Blob([response.data], {
                        type: "application/octet-stream"
                    });
                    const url = window.URL.createObjectURL(blob);
                    console.log(url);
                    link.href = url;
                    link.download = "xxx"; // 自定义文件名
                    link.click(); // 下载文件
                    // window.location.href = url
                    URL.revokeObjectURL(url);
                    return this.$message.success("下载完成");
                });
            },
            closeShow() {
                this.notTifUrls = [];
                this.imageSetInfo = "";
                this.imageStorageSize = "";
                this.downSetId = "";
                // console.log(this.downSetId)
            },
            getMB(byte) {
                return Math.round((byte / 1024 / 1024) * 100) / 100;
            },
            // image upload
            imageChooseFiles() {
                document.getElementById("imageFile").click();
            },
            handleImageUpload() {
                const that = this;
                that.imagePercentage = 0;
                that.imageList = document.getElementById("imageFile").files;
                // console.log(that.imageList);
                var formdata = new FormData();
                var size = 0;
                var temp = 1;
                var num = 0;
                var isFinished = true;
                var allImageCount = that.imageList.length
                for (let index = 0; index < allImageCount; index++) {
                    if (!isFinished) break;
                    const element = that.imageList[index];
                    // console.log(element.type);
                    if(that.imageList[allImageCount-1].type === ""){
                        allImageCount = allImageCount - 1;
                    }
                    if(element.size>=1024*1024*1024) return this.$message.error(element.name+"单文件过大！");
                    const reg = new RegExp("^(image/)(jpeg|tiff|png|bmp)");
                    if (reg.test(element.type)) {
                        console.log(allImageCount);
                        num++;
                        size += element.size;
                        formdata.append("file", element);
                        // 每100M一次请求
                        // console.log("dfg============"+this.imageList.length)
                        if (
                            size > 100 * 1024 * 1024 * temp ||
                            num === allImageCount // 数据根据情况 -1 未解决
                        ) {
                            // console.log("这是num值", num);
                            // console.log("这是总数值", this.imageList.length);
                            temp++;
                            console.log("大小" + size / 1024 / 1024 + "MB =====" + temp);
                            // console.log(formdata.getAll("file"));
                            formdata.append("imageSetId", that.imageSetId);
                            formdata.append("tag", that.imageSetTag);
                            formdata.append("usersTag", that.usersTag);
                            formdata.append("userId", that.userId);
                            // 发送请求
                            // console.log(formdata)
                            uploadImage(formdata).then(resp =>{
                                // console.log(resp);
                                if (resp.status === 208) {
                                    this.existImageList = resp.data;
                                    this.dialogTipVisible = true;
                                    isFinished = false;
                                    this.imageStatus = this.progressStatus[1];
                                    return;
                                }
                                if (resp.status !== 200)
                                    return that.$message.error("上传失败！请联系管理员");
                                that.imagePercentage += (resp.data / allImageCount) * 100;
                                console.log(that.imagePercentage+"%");
                                this.$message.success('上传成功！')
                            }).catch(error => {
                                console.log(formdata.getAll("file"));
                                console.log(error);
                                isFinished = false;
                            })
                            formdata = null;
                            formdata = new FormData();
                        }
                    } else if(element.type === ""){
                        continue;
                    } else {
                        return this.$message.error("文件格式可能不符合要求！请检查");
                    }
                }
                if (!isFinished) {
                    that.imageStatus = that.progressStatus[3];
                    return that.$message.error("上传失败！");
                }
                if(this.imagePercentage === 100)this.imageStatus = this.progressStatus[0];
                this.imageLoadedFiles =
                    "上传" +
                    num +
                    "文件" +
                    "，大小：" +
                    Math.round((size / 1024 / 1024) * 100) / 100 +
                    "MB";
                // this.$message.success('上传成功！')
            },
            // label upload
            labelChooseFiles() {
                document.getElementById("labelFile").click();
            },
            handleLabelUpload() {
                const that = this;
                this.labelList = document.getElementById("labelFile").files;
                var formdata = new FormData();
                var size = 0;
                var temp = 1;
                var num = 0;
                var isFinished = true;
                for (let index = 0; index < that.labelList.length; index++) {
                    if (!isFinished) break;
                    const element = that.labelList[index];
                    const reg = new RegExp("(.png|.txt|.xml|.tif|.mat|.json|.yaml)$", "i");
                    if (reg.test(element.name)) {
                        console.log("================reg");
                        if (
                            this.labelStyle !== element.name.split(".")[1] &&
                            this.labelStyle !== "mask"
                        ) {
                            this.labelStyle = element.name.split(".")[1];
                        }
                        num++;
                        size += element.size;
                        formdata.append("file", element);
                        // 每100M一次请求
                        if (size > 10 * 1024 * 1024 * temp || num === this.labelList.length) {
                            temp++;
                            console.log("大小" + size / 1024 / 1024 + "MB =====" + temp);
                            console.log(formdata.getAll("file"));
                            formdata.append("imageSetId", this.imageSetId);
                            formdata.append("labelStyle", this.labelStyle);
                            formdata.append("userId", that.userId);
                            formdata.append("labeledObject", that.labeledObject);
                            uploadLabel(formdata)
                                .then(res => {
                                    console.log(res);
                                    if (res.status === 208) {
                                        this.existLabelList = res.data;
                                        this.dialogTipVisible1 = true;
                                        isFinished = false;
                                        this.labelStatus = this.progressStatus[1];
                                        return;
                                    }
                                    if (res.status !== 200)
                                        return this.$message.error("上传失败！请联系管理员");
                                    this.labelPercentage += Math.round(
                                        (res.data / this.labelList.length) * 100
                                    );
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.labelStatus = this.progressStatus[2];
                                    isFinished = false;
                                });
                            formdata = null;
                            formdata = new FormData();
                        }
                    } else {
                        return this.$message.error("文件格式可能不符合要求！请检查");
                    }
                }
                if (!isFinished) return this.$message.error("上传失败！");
                this.labelStatus = this.progressStatus[0];
                this.labelLoadedFiles =
                    "上传了" +
                    num +
                    "文件" +
                    "，大小：" +
                    Math.round((size / 1024 / 1024) * 100) / 100 +
                    "MB";
            },
            clearImageUpload() {
                this.imageLoadedFiles = "未选择任何文件";
                this.imagePercentage = 0;
                this.labelLoadedFiles = "未选择任何文件";
                this.labelPercentage = 0;
                this.type.first = "";
                this.type.second = "";
                this.type.third = "";
                // 清空所选文件夹 但可能会导致用户多次上传
                // document.getElementById('imageFile').outerHTML = document.getElementById('imageFile').outerHTML
                // document.getElementById('labelFile').outerHTML = document.getElementById('labelFile').outerHTML
            },
            clearLabelUpload() {
                this.imageLoadedFiles = "未选择任何文件";
                this.imagePercentage = 0;
                this.labelLoadedFiles = "未选择任何文件";
                this.labelPercentage = 0;
                this.type.first = "";
                this.type.second = "";
                this.type.third = "";
                // 清空所选文件夹 但可能会导致用户多次上传
                // document.getElementById('imageFile').outerHTML = document.getElementById('imageFile').outerHTML
                // document.getElementById('labelFile').outerHTML = document.getElementById('labelFile').outerHTML
            },
            handleSelectionChange(val) {
                console.log(val);
                this.simple.imageSets = val;
            },
            findImageSets() {
                console.log(this.simple.dlType);
                findImageSet(this.simple.dlType).then(res => {
                    if (res.status !== 200) return this.$message.error("获取失败！");
                    this.imageSetsForSelection = res.data;
                    if (this.imageSetsForSelection.length === 0)
                        return this.$message.warning("该类型下目前无数据集！");
                });
            },
            createSimple() {
                this.simple.userId = this.userId;
                if (this.simple.imageSets.length < 1)
                    return this.$message.error("请选择数据集！");
                console.log(this.simple);
                // this.simple.imageSets = []
                this.$refs.simpleRef.validate((valid) => {
                    if (valid) {
                        insertSimple(this.simple).then(res => {
                            if (res.status !== 200) return this.$message.error("创建失败！");
                            console.log(res);
                            this.$refs.simpleRef.resetFields();
                            this.simple.imageSets = [];
                            this.creating = false;
                            this.findSimples(this.userId);
                            return this.$message.success("创建样本成功！");
                        });
                    }
                })
            },
            findSimples(userId) {
                findSimpleByUser(userId).then(res => {
                    if (res.status !== 200) return;
                    this.simplesData = res.data;
                    console.log(res.data)
                });
            },
            delSimple(simpleId) {
                this.delSimpleId = simpleId
                this.deleteDialogVisible = true
            },
            handleDel() {
                delSimpleById(this.delSimpleId).then(res => {
                    if (res.status !== 200) return this.$message.error("删除失败！");
                    this.findSimples(this.userId)
                    return this.$message.success("删除成功！");
                }).catch(err=>{
                    console.log(err)
                    return this.$message.error("该样本集存在已关联的任务！");
                })
            },
            delImageSet(imageSetId) {
                this.delImageSetId = imageSetId
                this.deleteImageSetDialogVisible = true
            },
            handleDelImageSet() {
                delImageSet(this.delImageSetId).then(res => {
                    if (res.status !== 200) return this.$message.error("删除失败！");
                    this.findSetAll()
                    return this.$message.success("删除成功！");
                }).catch(err=>{
                    console.log(err)
                    return this.$message.error("请您先删除所关联的样本集！");
                })
            }
        },
        mounted() {
            this.findSetAll();
            this.createSet();
        }
    };
</script>

<style lang='less' scoped>
    .data {
        // background-color: aquamarine;
        height: 800px;
        overflow-y: auto;

        .hidden-row {
            display: none;
        }

        .upload-title {
            padding: 5px;
            font-size: 16px;
        }

        .uploader-btn {
            background-color: #409efe;
            border: none;
            color: white;
        }

        .inputFileNum {
            margin-top: 5px;
            color: darkcyan !important;
        }

        .uploadTip {
            font-size: 12px;
            color: rgb(97, 97, 97);
        }

        .card-height {
            /*height: 400px;*/

            .el-select {
                margin: 5px 5px 5px 0;
            }
        }

        .progressPosition {
            position: inherit;
            bottom: 0;
        }

        .image__lazy {
            overflow: scroll;
            height: 400px;
        }

        .m-margin {
            margin: 10px 0;
        }

        .imageInfo {
            height: 400px;
            margin-bottom: 10px;
        }

        #createSimpleContainer {
            margin: 50px 0;
            padding: 0 20px;
            border: 1px solid rgb(231, 231, 231);
            border-radius: 5px;
        }

        #simpleMangement {
            margin: 20px 0;

            .el-card {
                .el-row {
                    .el-col {
                        // height: 150px;
                        .simpleName {
                            vertical-align: middle;
                            font-size: 16px;
                            color: #00c8cf;
                        }

                        .imageSet {
                            height: 150px;
                            width: 150px;
                            border-top: 1px solid hotpink;

                            .imageSetThumb {
                                width: 100%;
                                display: block;
                            }

                            .el-image {
                                color: gray;
                                width: 150px;
                                height: 150px;
                                line-height: 130px;
                                font-size: 30px;
                                text-align: center;
                            }

                            .el-image:hover {
                                cursor: pointer;
                            }

                            .image-slot {
                                font-size: 40px;
                            }

                            .imageSetTitle {
                                position: relative;
                                background-color: rgba(5, 170, 182, 0.8);
                                color: white;
                                font-size: 16px;
                                text-align: center;
                                line-height: 30px;
                                height: 30px;
                                bottom: 30px;
                            }

                            .imageSetTitle:hover {
                                cursor: pointer;
                            }
                        }

                        .imageSetHeighten {
                            height: 150px;
                            width: 150px;
                            border-top: 1px solid rgb(12, 125, 231);

                            .el-image {
                                color: gray;
                                width: 150px;
                                height: 150px;
                                line-height: 130px;
                                font-size: 30px;
                                text-align: center;
                            }

                            .el-image:hover {
                                cursor: pointer;
                            }

                            .image-slot {
                                font-size: 40px;
                            }

                            .imageSetTitle {
                                position: relative;
                                background-color: rgba(12, 125, 231, 0.8);
                                color: white;
                                font-size: 16px;
                                text-align: center;
                                line-height: 30px;
                                height: 30px;
                                bottom: 30px;
                            }

                            .imageSetTitle:hover {
                                cursor: pointer;
                            }
                        }

                        .simplehandle {
                            height: 150px;
                            line-height: 150px;
                        }
                    }
                }
            }

            .m-margin-bottom {
                margin-bottom: 10px;
            }
        }
    }

    .data::-webkit-scrollbar {
        width: 3px;
    }

    .data::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(5, 170, 182, 0.4);
    }
</style>
