<template>
  <div id="task_container">
    <el-card shadow="never">
      <div slot="header">
        <span>任务管理</span>
        <el-button
          style="float: right; padding: 3px 0"
          icon="el-icon-edit"
          @click="createTask"
          type="text"
        >创建任务</el-button>
      </div>
      <el-card v-show="!isCreateTask" style="text-align: center; color: #888">
        <p>暂无任务，请创建</p>
      </el-card>
      <div class="executedTask" v-for="item in taskData" :key="item.taskId"  v-show="isCreateTask">
        <el-row :gutter="5">
          <el-col :span="5">
            <el-card class="m-card" shadow="hover" :body-style="{ padding: '0px'}">
              <el-button
                      class="task-action"
                      :type="statusColor"
                      :icon="envIcon"
                      :disabled="isAble"
                      @click="handleEdit(item)"
              > <div>{{statusValve}}</div></el-button>
              <div style="padding: 14px;">
                <span>{{item.taskName}}</span>
                <el-divider/>
                <div class="edit-button">
                  <el-button
                          type="success"
                          class="button"
                          icon="el-icon-s-operation"
                          :disabled="isReady"
                          @click="handleJupyter(item)"
                  >调试训练</el-button>
                  <el-button
                          type="danger"
                          class="button"
                          icon="el-icon-remove-outline"
                          :loading="loadingState.deleteCurrTaskLoading"
                          @click="handleCancel(item)"
                  >删除任务</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="19">
            <el-card shadow="never" class="taskHandle">
              <el-row :gutter="30">
                <el-col :span="10">
                  <div>
                      <p class="taskInfoTitle">任务使用样本集：</p>
                      <p class="taskInfoSubTitle">{{item.simple.simpleName}}</p>
                      <ol class="itemChildBox">
                        <li class="taskInfoItem" v-for="imageSet in item.simple.imageSets" :key="imageSet.imageSetId">
                          {{imageSet.imageSetName}}
                        </li>
                      </ol>
                      <el-button type="primary"
                                 :disabled="isReady"
                                 style="margin-top:20px; width: 100%; font-size: 14px" size="small"
                                 @click="dialogEnhanceFormVisible = true, enhanceSimple(item.simple)">
                        增强数据集上传
                        <i class="el-icon-upload el-icon--right"/>
                      </el-button>
                  </div>
                </el-col>
                <el-col :span="14">
                  <div>
                      <p class="taskInfoTitle">任务使用模型：</p>
                      <p class="taskInfoSubTitle">{{item.model.modelName}}</p>
                    <ol class="itemChildBox">
                      <li class="taskInfoItem" v-for="cModel in item.model.childModel" :key="cModel.modelChildId">
                        {{cModel.originalName}}
                      </li>
                    </ol>
                      <el-button style="margin-top:20px; width: 48%; float: right"
                                 :disabled="isReady"
                                 @click="saveModel(item.node.nodeId,item.model.modelId)" type="primary">
                        保存模型 <i class="el-icon-suitcase el-icon--right"/>
                      </el-button>
                    <el-upload
                            ref="modelUpload"
                            :action="uploadUrl"
                            :data="{nodeId:item.node.nodeId}"
                            :headers="{Authorization: token}"
                            :on-progress="handleProgress"
                            :on-success="handleSuccess"
                            multiple>
                      <el-button type="primary" class="el-upload__text" :disabled="isReady" @click="handelUploadUrl()">
                        点击上传模型文件<i class="el-icon-upload"/>
                      </el-button>
<!--                      <el-progress :percentage="modelFilePercentage"/>-->
                      <div slot="tip" class="el-upload__tip">单文件不能超过1G</div>
                    </el-upload>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
        <el-collapse-transition>
        <el-card v-show="isactiveJupyter" shadow="hover" class="jupyterFrame">
            <el-button type="primary" icon="el-icon-back" @click="back()" circle/>
        <el-link type="success" style="margin:0 20px" :href="jupyterLink" target="view_windows">新页面打开</el-link>
          <el-button type="primary" icon="el-icon-full-screen" @click="handleFullScreen()" circle/>
            <div class="jupyterFrame">
              <iframe
                      webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""
                    name="iframeMap"
                    id="iframeMapViewComponent"
                    :src="jupyterLink"
                    width="100%"
                    height="90%"
                    frameborder="0"
                    scrolling="no"
                    ref="iframeDom"
            ></iframe>
            </div>
        </el-card>
<!--      </div>-->
        </el-collapse-transition>

        <el-divider></el-divider>
        <h4 style="font-weight: normal">已完成任务</h4>
        <el-card shadow="never" style="margin-top: 20px">
            <div v-for="task in finishTaskData" :key="task.taskId">
                <p class="taskInfoTitle">任务名称：{{task.taskName}}</p>
                <p class="taskInfoSubTitle">用户：{{task.user.username}}</p>
                <p class="taskInfoSubTitle">模型名称：{{task.model.modelName}}</p>
                <p class="taskInfoSubTitle">样本集名称：{{task.simple.simpleName}}</p>
                <ol>
                    <li v-for="imageSet in task.simple.imageSets" :key="imageSet.imageSetId" class="taskInfoItem">{{imageSet.imageSetName}}</li>
                </ol>
              <el-dropdown placement="bottom" type="primary" style="width: 24%">
                <el-button :disabled="modelDownloadDisable" style="width: 98%" type="primary">
                  下载模型<i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu class="modelDownload" slot="dropdown">
                  <el-dropdown-item @click.native="dowanloadModel(task.model.modelId)">{{task.model.originalName}}</el-dropdown-item>
                  <el-dropdown-item v-for="(cmodel,i) in task.model.childModel" :key="cmodel.modelChildId" @click.native="downModelChild(cmodel.modelChildId)" :divided="i === 0">{{cmodel.originalName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
                <el-button style="width: 24%" @click="downloadResult(task.taskId)"
                           :loading="loadingState.downloadResultLoading"
                           type="primary">下载结果</el-button>
                <el-button style="width: 24%" @click="downloadEnhancedSet(task.taskId,task.simple.enhancedImageSet.imageSetName)"
                           :loading="loadingState.downloadSimpleLoading"
                           :disabled="!task.simple.enhancedImageSet"
                           type="primary">下载增强样本集</el-button>
                <el-button style="width: 24%" @click="delComfirmDialogVisible = true,delTaskId = task.taskId" type="danger">删除</el-button>
              <el-divider/>
            </div>
        </el-card>
    </el-card>
    <!-- 创建任务 -->
    <!-- 创建任务 -->
    <el-dialog title="创建任务" @closed="clearDialog()" width="55%" :visible.sync="dialogFormVisible">
      <el-steps :active="active" :finish-status="stepFinishStatus">
        <el-step title="选择训练类型"></el-step>
        <el-step title="选择样本集"></el-step>
        <el-step title="选择模型"></el-step>
        <el-step title="节点配置"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-divider></el-divider>
      <el-carousel
        indicator-position="none"
        ref="createTaskRef"
        arrow="always"
        :loop="false"
        :autoplay="false"
        @change="change"
      >
        <el-carousel-item>
          <el-card class="m-marginRL">
            <el-form :model="task" ref="taskRef" label-width="90px">
              <el-form-item
                label="任务名称"
                prop="taskName"
                :rules="[
                    { required: true, message: '任务名称不能为空'}
                  ]"
              >
                <el-input placeholder="请输入训练任务名称" v-model="task.taskName"></el-input>
              </el-form-item>
            </el-form>
            <div class="m-boxcenter">
              <el-radio
                v-model="task.taskType"
                v-for="(item, index) in taskType"
                :key="index"
                :label="item"
                border
              >{{item}}</el-radio>
            </div>
          </el-card>
        </el-carousel-item>
        <el-carousel-item>
          <el-card class="m-marginRL">
              <el-divider content-position="left">您创建的适合该领域的样本集</el-divider>
              <el-radio
                      v-model="task.simple"
                v-for="item in checkOptions"
                :key="item.simpleId"
                :label="item"
              >{{ item.simpleName }}</el-radio>
          </el-card>
        </el-carousel-item>
        <el-carousel-item>
          <el-card class="m-marginRL">
            <el-divider content-position="left">您创建的适合该领域的模型</el-divider>
            <el-radio
              v-model="task.model"
              v-for="item in modelOptions"
              :key="item.modelId"
              :label="item"
            >{{item.modelName}}</el-radio>
            <el-divider content-position="left">其他适合该领域的模型</el-divider>
            <el-radio
              v-model="task.model"
              v-for="item in OtherModelOptions"
              :key="item.modelId"
              :label="item + ',' + item.modelName"
            >{{item.modelName}}</el-radio>
          </el-card>
        </el-carousel-item>
        <el-carousel-item>
          <el-card class="m-marginRL">
<!--            <el-radio-->
<!--              v-model="task.node"-->
<!--              v-for="item in nodeOptions"-->
<!--              :key="item.nodeId"-->
<!--              :label="item"-->
<!--            >{{item.operationSystem}}</el-radio>-->
            <el-table
                    ref="singleTable"
                    :data="nodeOptions"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    style="width: 100%">
              <el-table-column
                      type="index"
                      width="50">
              </el-table-column>
              <el-table-column
                      property="operationSystem"
                      label="操作系统"
                      width="120">
              </el-table-column>
              <el-table-column
                      property="cudaVersion"
                      label="CUDA版本"
                      width="120">
              </el-table-column>
              <el-table-column
                      property="cudnnVersion"
                      label="cuDNN版本">
              </el-table-column>
              <el-table-column
                      property="trainEnvironment"
                      label="环境">
              </el-table-column>
            </el-table>
          </el-card>
        </el-carousel-item>
        <el-carousel-item>
          <el-card class="m-marginRL">
            <div class="m-boxcenter">
              <el-progress type="circle" :percentage="percentage" :status="status"/>
            </div>
          </el-card>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 创建表单 -->
    <el-dialog title="上传增强/补充样本集" width="55%" @close="resetEnhanceForm()" :visible.sync="dialogEnhanceFormVisible">
        <el-card shadow="always">
            <!-- 创建数据集 -->
            <el-form
                    ref="enhanceFormRef"
                    :model="enhanceFrom"
                    :inline="false"
                    :rules="enhanceFormRules"
                    label-width="120px"
            >
                <el-form-item label="影像集名称" prop="imageSetName">
                    <el-input v-model="enhanceFrom.imageSetName" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="训练领域" prop="imageSetType">
                    <el-select v-model="enhanceFrom.imageSetType">
                        <el-option
                                v-for="(item, index) in taskType"
                                :key="index"
                                :label="item"
                                :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="数据集来源链接" prop="dataSourceUrl">
                    <el-input placeholder="开源数据集请输入开源url，其他选输入‘自建’"
                              v-model="enhanceFrom.dataSourceUrl"/>
                </el-form-item>
                <el-form-item label="数据年份" prop="year">
                    <el-input placeholder="请输入年份" v-model="enhanceFrom.year"/>
                </el-form-item>
                <el-form-item label="影像分辨率" prop="resolution">
                    <el-input placeholder="请输入分辨率，如：30m" v-model="enhanceFrom.resolution"/>
                </el-form-item>
                <el-form-item label="尺寸大小" prop="size">
                    <el-input placeholder="请输入尺寸，如：25×25" v-model="enhanceFrom.size"/>
                </el-form-item>
                <el-form-item label="影像坐标系" prop="srs">
                    <el-input placeholder="若有地理坐标系，请填写" v-model="enhanceFrom.srs"/>
                </el-form-item>
                <el-form-item label="影像传感器" prop="sensor">
                    <el-input placeholder="请输入影像传感器" v-model="enhanceFrom.sensor"/>
                </el-form-item>
                <el-form-item label="数据集介绍" prop="imageSetInfo">
                    <el-input
                            maxlength="200"
                            placeholder="请简要介绍数据集, 不要超过200个汉字！"
                            show-word-limit
                            type="textarea"
                            v-model="enhanceFrom.imageSetInfo"
                    />
                </el-form-item>
                <br/>
                <el-form-item>
                    <el-button type="primary" @click="submitEnhanceForm()">立即创建</el-button>
                    <el-button @click="resetEnhanceForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-dialog>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="finishDialogVisible" width="30%" center>
      <span>确定要结束任务吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finishDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishDialogVisible = false, finishTask(os)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delComfirmDialogVisible" width="30%" center>
      <span>确定要删除任务吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delComfirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delComfirmDialogVisible = false, delTask(delTaskId)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%" center>
      <span>请您先结束任务！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="TipDialogVisible" width="30%">
      <span>可能需要一段时间，请耐心等候！</span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="taskWaitingDialog" width="30%">
      <span>该节点正在使用中，您前面还有 {{waitingIndex}} 人，请等待！</span>
    </el-dialog>
  </div>
</template>

<script>
import {
  findByUserId,
  findByUserIdAndStatus,
  insert,
  findTasksByOrder,
  updateStatus,
  delTask,
  prepareTaskForWin,
  prepareTaskForLinux,
  finishTaskForWin,
  finishTaskForLinux,
  downloadResult,
  uploadEnhanceImageSet,
    downloadEnhancedSet
} from "../api/task";
import { getDLtype } from "../api/category";
import {
  findAllByUserIdAndType,
  findAllByUserIdNotAndType,
    saveTaskModel,
    findModelById,
    findChildModelById
} from "../api/model";
import { findAll, findById } from "../api/node";
import { findSimpleByUserAndType, enhanceSimple } from "../api/simple"
import { getUserByName } from "../api/user"
import { baseURL,JUPYTERURL } from "../api/url"

export default {
  data() {
    return {
      uploadUrl: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      stepStatus: ['wait', 'process', 'finish ', 'error ','success'],
      stepFinishStatus:'success',
      active: 0,
      checkOptions: [],
      taskType: [],
      modelOptions: [],
      nodeOptions: [],
      OtherModelOptions: [],
      task: {
        taskName: "",
        taskType: "",
        simple: null,
        user: null,
        node: null,
        model: null
      },
      loadingState: {
        createLoading: false,
        startLoading: false,
        stopLoading: false,
        enhanceSimpleLoading: false,
        uploadModelFileLoading: false,
        saveModelLoading: false,
        downloadModelLoading: false,
        downloadResultLoading: false,
        downloadSimpleLoading: false,
        deleteTaskLoading: false,
        deleteCurrTaskLoading: false,
      },
      // 进度
      percentage: 10,
      status: "success",
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ],
      // taskList
      taskData: [],
      isCreateTask: false,
      waitingIndex: 0,
      envIcon: "el-icon-video-play",
      // 0 开始 1 准备中 2 准备完成 3 训练中
      statusValve: "",
      statusColor: "primary",
      isAble: false,
      isReady: true,
      currentTask: {
        taskId: "",
        nodeId: "",
        status: ""
      },
      finishDialogVisible: false,
      finishTaskData: [],
      os: "",
      TipDialogVisible: false,
      taskWaitingDialog: false,
      SSHForm: {
        Ip: "",
        cmd: ""
      },
      isExcute: false,
      log: "",
      isDisable: true,
      jupyterLink: "",
      isactiveJupyter: false,
      delDialogVisible: false,
      // 增强样本集
      dialogEnhanceFormVisible: false,
      enhanceFrom: {
        imageSetName: "",
        imageSetType: "",
        dataSourceUrl: "自增强",
        resolution: "",
        size: "",
        srs: "",
        year: "",
        sensor: "",
        imageSetInfo: ""
      },
      enhanceFormRules: {
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
      TypeOptions: [],
        token: "",
        modelFilePercentage: 0,
        modelDownloadDisable: false,
        delComfirmDialogVisible: false,
        delTaskId: ""
    };
  },
  mounted() {
    this.findTaskList();
    this.findImageSet();
  },
  computed: {},
  methods: {
      async findImageSet() {
          const that = this;
          getDLtype("/dlType/findAll").then(res => {
              if (res.status !== 200) {
                  return this.$message.error("数据库连接失败！请检查...");
              }
              that.taskType = res.data;
          });
      },
      async change(val, oldval) {
          const that = this;
          const taskType = that.task.taskType;
          const userId = that.task.user.userId;
          // val 当前页值
          // oldval 上一页值
          this.active = val;
          if (val === 1 && oldval === 0) {
              if (that.task.taskType === "") {
                  this.stepFinishStatus = this.stepStatus[3];
                  this.$refs.createTaskRef.setActiveItem(0);
                  return this.$message.error("请选择训练领域");
              }
              if (that.task.taskName === "") {
                  this.stepFinishStatus = this.stepStatus[3];
                  this.$refs.createTaskRef.setActiveItem(0);
                  return this.$message.error("请填写任务名称");
              }
              findSimpleByUserAndType(userId, taskType).then(res => {
                  console.log(res);
                  if (res.status !== 200) {
                      this.stepFinishStatus = this.stepStatus[3];
                      return this.$message.error("连接错误！");
                  }
                  that.checkOptions = res.data;
              });
              this.stepFinishStatus = this.stepStatus[4];
          }
          // console.log(val)
          // console.log(oldval)
          console.log(that.task.simple)
          if (val === 2 && oldval === 1) {
              // if (that.modelOptions.length > 0 || that.OtherModelOptions.length > 0)
              //   return;
              if (that.task.simple === null) {
                  this.stepFinishStatus = this.stepStatus[3];
                  this.$refs.createTaskRef.setActiveItem(1);
                  return this.$message.error("请选择样本集");
              }
              findAllByUserIdAndType(userId, taskType).then(res => {
                  console.log(res);
                  if (res.status !== 200) {
                      this.stepFinishStatus = this.stepStatus[3];
                      return this.$message.error(res.data.message);
                  }
                  that.modelOptions = res.data;
              });
              findAllByUserIdNotAndType(userId, taskType).then(res => {
                  if (res.status !== 200) {
                      this.stepFinishStatus = this.stepStatus[3];
                      return this.$message.error(res.data.message);
                  }
                  that.OtherModelOptions = res.data;
              });
              this.stepFinishStatus = this.stepStatus[4];
          }
          if (val === 3 && oldval === 2) {
              if (that.task.model === null) {
                  this.stepFinishStatus = this.stepStatus[3];
                  that.status = "exception";
                  this.$refs.createTaskRef.setActiveItem(2);
                  return this.$message.error("请选择模型");
              }
              findAll().then(res => {
                  if (res.status !== 200) {
                      this.stepFinishStatus = this.stepStatus[3];
                      return this.$message.error("网络错误，请稍后再试！");
                  }
                  that.nodeOptions = res.data;
              });
              this.stepFinishStatus = this.stepStatus[4];
          }
          if (val === 4 && oldval === 3) {
              if (that.task.node === null) {
                  this.stepFinishStatus = this.stepStatus[3];
                  that.status = "exception";
                  this.$refs.createTaskRef.setActiveItem(3);
                  return this.$message.error("请选择节点");
              }
              that.percentage = 20;
              console.log(this.task)
              insert(that.task).then(res => {
                  that.percentage = 50;
                  if (res.status !== 200) {
                      this.stepFinishStatus = this.stepStatus[3];
                      that.status = "exception";
                      return this.$message.error("创建失败");
                  }
                  // console.log(res.data.data)
                  that.percentage = 100;
                  that.status = "success";
                  that.isReady = true;
                  that.active = 5;
                  this.dialogFormVisible = false
              }).catch(err => {
                  that.status = "exception";
                  console.log(err)
              });
              this.stepFinishStatus = this.stepStatus[4];
          }
          // if (val === 2) { this.active = 3 } else this.active = val
      },
      handleCurrentChange(val) {
          this.task.node = val;
      },
      createTask() {
          console.log(this.isCreateTask);
          if (this.isCreateTask) {
              this.dialogFormVisible = false;
              return this.$message.error("请完成已创建任务后再新建任务！");
          }
          this.dialogFormVisible = true;
      },
      clearDialog() {
          this.findTaskList();
          this.active = 0;
          this.$refs.createTaskRef.setActiveItem(0);
          this.task.taskName = "";
          this.task.taskType = "";
          // this.task.imageSetId = ''
          // this.task.modelId = ''
          this.percentage = 10;
          this.status = "success";
      },
      async findTaskList() {
          const that = this;
          // const userId = sessionStorage.getItem("userId");
          const username = sessionStorage.getItem("username");
          getUserByName(username).then(res => {
              if (res.status !== 200) {
                  return this.$message.error("数据库连接失败！请检查...");
              } else {
                  console.log(res)
                  that.task.user = res.data
                  findByUserId(that.task.user.userId).then(res => {
                      console.log(res.data);
                      if (res.status !== 200) {
                          return this.$message.error("数据库连接失败！请检查...");
                      } else if (res.data.length === 0) {
                          this.isCreateTask = false;
                      } else {
                          this.isCreateTask = true;
                      }
                      // console.log(res.data.data)
                      if (res.data.length === 1) {
                          that.taskData = res.data;
                          that.currentTask.status = res.data[0].status;
                          that.currentTask.taskId = res.data[0].taskId;
                          if (that.currentTask.status !== 0) that.isReady = false;
                          that.trainStatus(that.currentTask.status);
                      }
                  });
                  findByUserIdAndStatus(that.task.user.userId, 3).then(res1 => {
                      console.log(res1)
                      if (res1.status !== 200) {
                          return this.$message.error("连接错误");
                      }
                      that.finishTaskData = res1.data;
                  });
              }
          })
      },
      async handleEdit(row) {
          console.log(row.taskId)
          var envStatus = this.currentTask.status;
          // this.currentTask.taskId = row.taskId
          this.currentTask.nodeId = row.node.nodeId;
          findById(row.node.nodeId).then(res => {
              if (res.status !== 200) {
                  return this.$message.error("数据库连接失败！请检查...");
              }
              if (res.data.status === 1 && envStatus === 0) {
                  findTasksByOrder(row.taskId, row.node.nodeId).then(waitRes => {
                      console.log(waitRes);
                      if (waitRes.data > 0) {
                          this.waitingIndex = waitRes.data;
                          this.taskWaitingDialog = true;
                          return;
                      }
                  });
              }
              this.os = res.data.systemType;
              console.log(res);
          });
          // console.log(envStatus)
          const color = ["primary", "warning", "success", "danger"];
          const status = ["环境准备", "准备中", "准备完成", "结束任务"];
          if (envStatus === 0) {
              this.envIcon = "el-icon-loading";
              this.statusColor = color[1];
              this.statusValve = status[1];
              this.isAble = true;
              this.prepareTask(this.os);
          }
          if (envStatus === 2) {
              this.finishDialogVisible = true;
          }
      },
      trainStatus(status) {
          switch (status) {
              case 0:
                  break;
              case 1:
                  this.envIcon = "el-icon-circle-check";
                  this.statusColor = "success";
                  this.statusValve = "准备完成";
                  this.isAble = true;
                  this.isReady = false;
                  break;
              case 2:
                  this.envIcon = "el-icon-circle-close";
                  this.statusColor = "danger";
                  this.statusValve = "结束任务";
                  break;
          }
      },
      async handleJupyter(row) {
          this.currentTask.status = 2;
          updateStatus(this.currentTask.taskId, 2).then(res => {
              console.log(res);
              if (res.status !== 200) {
                  return this.$message.error("数据库连接失败！请检查...");
              }
              this.trainStatus(2);
              this.isAble = false;
              // this.jupyterLink = 'http://' + row.nodeIP + ':8888'
              this.isactiveJupyter = !this.isactiveJupyter;
              const ipd = row.node.nodeIp.split(".")[3];
              this.jupyterLink = JUPYTERURL + "jupyter" + ipd;
          });
      },
      async handleCancel(row) {
          console.log(row.status);
          this.loadingState.deleteCurrTaskLoading = true
          if (row.status === 0 || row.status === 3) {
              delTask(row.taskId).then(res => {
                  if (res.status !== 200) return this.$message.error("删除任务失败！");
                  this.taskData = [];
                  this.findTaskList();
                  this.loadingState.deleteCurrTaskLoading = false
              }).catch( () => {
                this.loadingState.deleteCurrTaskLoading = false
              });
          } else {
              this.delDialogVisible = true;
          }
      },
      async prepareTask(os) {
          this.TipDialogVisible = true;
          console.log(this.currentTask.taskId)
          if (os === "Windows") {
              prepareTaskForWin(this.currentTask).then(res => {
                  if (res.status !== 200) {
                      return this.$message.error("数据库连接失败！请检查...");
                  }
                  this.trainStatus(1);
                  this.TipDialogVisible = false;
              });
          } else {
              prepareTaskForLinux(this.currentTask).then(res => {
                  if (res.status !== 200) {
                      return this.$message.error("数据库连接失败！请检查...");
                  }
                  this.trainStatus(1);
                  this.TipDialogVisible = false;
              });
          }
      },
      async finishTask(os) {
          if (os === "Windows") {
              finishTaskForWin(this.currentTask).then(res => {
                  if (res.status !== 200) {
                      return this.$message.error("数据库连接失败！请检查...");
                  }
                  this.taskData = [];
                  this.jupyterLink = "";
                  this.findTaskList();
                  this.isactiveJupyter = false;
                  this.envIcon = "el-icon-video-play";
                  this.statusColor = "primary";
                  return this.$message.success(res.data);
              });
          } else {
              finishTaskForLinux(this.currentTask).then(res => {
                  if (res.status !== 200) {
                      return this.$message.error("数据库连接失败！请检查...");
                  }
                  this.taskData = [];
                  this.jupyterLink = "";
                  this.findTaskList();
                  this.isactiveJupyter = false;
                  this.envIcon = "el-icon-video-play";
                  this.statusColor = "primary";
                  return this.$message.success(res.data);
              });
          }
      },
      taskFinishCancel() {
          this.trainStatus(2);
      },
      downResultByBlob(index, row) {
          console.log(row.taskId);
          downloadResult(row.taskId).then(response => {
              const blob = new Blob([response.data]);
              const fileName = row.taskName + "_result.zip";
              if ("download" in document.createElement("a")) {
                  // 非IE下载
                  const elink = document.createElement("a");
                  elink.download = fileName;
                  elink.style.display = "none";
                  elink.href = URL.createObjectURL(blob);
                  document.body.appendChild(elink);
                  elink.click();
                  URL.revokeObjectURL(elink.href); // 释放URL 对象
                  document.body.removeChild(elink);
              } else {
                  // IE10+下载
                  navigator.msSaveBlob(blob, fileName);
              }
              // const url = window.URL.createObjectURL(blob)
              // window.location.href = url
              if (response.status !== 200) return this.$message.error(response.data);
              return this.$message.success("下载成功！");
          });
      },
      enhanceSimple(simple) {
          this.enhanceFrom.simpleId = simple.simpleId;
          this.enhanceFrom.imageSetName = simple.simpleName + "-增强";
          this.enhanceFrom.imageSetType = simple.dlType;
          this.enhanceFrom.year = simple.createTime.substring(0, 4);

          let info = "该样本集由";
          for (let index = 0; index < simple.imageSets.length; index++) {
              const element = simple.imageSets[index];
              if (index === simple.imageSets.length - 1) {
                  info = element.imageSetName;
              } else {
                  info = element.imageSetName + "、";
              }
          }
          this.enhanceFrom.imageSetInfo = info
      },
      submitEnhanceForm() {
          const that = this
          enhanceSimple(this.enhanceFrom).then(res => {
              if (res.status !== 200) {
                  return that.$notify.error({
                      title: '错误',
                      message: '增强样本集创建失败，请联系管理员！'
                  })
              }
              this.dialogEnhanceFormVisible = false;
              this.TipDialogVisible = true;
              uploadEnhanceImageSet({
                  taskId: this.currentTask.taskId,
                  imageSetId: res.data.imageSetId
              }).then(resp => {
                  if (res.status !== 200) {
                      return that.$notify.error({
                          title: '错误',
                          message: '增强样本集上传失败，请联系管理员！'
                      })
                  }
                  this.TipDialogVisible = false
                  return that.$notify.success({
                      title: '成功',
                      message: resp.data
                  })
              })
          })
          console.log("增强表单提交");
      },
      resetEnhanceForm() {
          this.$refs.enhanceFormRef.resetFields();
      },
      saveModel(nodeId, modelId) {
          this.TipDialogVisible = true
          const that = this
          console.log(modelId)
          saveTaskModel({nodeId: nodeId, modelId: modelId}).then(res => {
              this.TipDialogVisible = false
              console.log(res)
              if (res.status !== 200) return that.$notify.error({
                  title: '失败',
                  message: res.data
              })
              return that.$notify.success({
                  title: '成功',
                  message: res.data
              })
          })
      },
      handelUploadUrl() {
          this.modelFilePercentage = 0;
          this.uploadUrl = baseURL + "model/uploadFile";
          console.log(this.uploadUrl);
          this.token = window.sessionStorage.getItem('Authorization');
      },
      handleSuccess(res, file, fileList) {
          const that = this
          console.log(res)
          console.log(file)
          console.log(fileList)
          console.log(this.$refs.modelUpload[0]);
          this.$notify.success({
              title: '成功',
              message: file.name + "--" + res, duration: 1500
          })
          setTimeout(function () {
              that.$refs.modelUpload[0].clearFiles();
          }, 1000);
      },
      handleProgress(e) {
          this.modelFilePercentage = e.loaded / e.total * 100 | 0
      },
      dowanloadModel(modelId){
          this.modelDownloadDisable = true;
          const that = this;
          const link = document.createElement("a");
          findModelById(modelId).then(res=>{
              this.modelDownloadDisable = false;
              if (res.status !== 200) return that.$notify.error({
                  title: '失败',
                  message: "获取失败"
              })
              link.href = res.data;
              setTimeout(() => {
                  link.click(); // 下载文件
              }, 200);
              return that.$notify.success({
                  title: '成功',
                  message: "获取成功"
              })
          }).catch(() => {
            this.modelDownloadDisable = false;
          })
      },
      downModelChild(modelChildId){
          this.modelDownloadDisable = true
          const that = this
          const link = document.createElement("a");
          findChildModelById(modelChildId).then(res=>{
              this.modelDownloadDisable = false
              if (res.status !== 200) return that.$notify.error({
                  title: '失败',
                  message: "获取失败"
              })
              link.href = res.data;
              setTimeout(() => {
                  link.click(); // 下载文件
              }, 200)
              return that.$notify.success({
                  title: '成功',
                  message: "获取成功！"
              })
          }).catch(() => {
            this.modelDownloadDisable = false;
          })
      },
      downloadResult(taskId){
          this.loadingState.downloadResultLoading = true
          const that = this
          const link = document.createElement("a");
          downloadResult(taskId).then(res=>{
              if (res.status !== 200) {
                this.loadingState.downloadResultLoading = false
                return that.$notify.error({
                  title: '失败',
                  message: "获取失败,结果可能不存在！"
                });
              }
              link.href = res.data;
              setTimeout(() => {
                  link.click(); // 下载文件
                this.loadingState.downloadResultLoading = false
              }, 200);
              return that.$notify.success({
                  title: '成功',
                  message: "获取成功！"
              })
          }).catch(() => {
            this.loadingState.downloadResultLoading = false
            return that.$notify.error({
              title: '失败',
              message: "下载失败！"
            });
          })
      },
      downloadEnhancedSet(taskId,imageSetName){
        if (!imageSetName) return that.$notify.error({
          title: '提示',
          message: "该任务没有增强样本！"
        });
          this.loadingState.downloadSimpleLoading = true
          const that = this
          downloadEnhancedSet(taskId).then(res=>{
              if (res.status !== 200) {
                this.loadingState.downloadSimpleLoading = false
                return that.$notify.error({
                  title: '失败',
                  message: "获取失败,结果可能不存在！"
                });
              }
              const blob = new Blob([res.data], {type: 'application/zip'});
              const fileName = imageSetName + ".zip";
              if ("download" in document.createElement("a")) {
                  // 非IE下载
                  const elink = document.createElement("a");
                  elink.download = fileName;
                  elink.style.display = "none";
                  elink.href = window.URL.createObjectURL(blob);
                  document.body.appendChild(elink);
                  elink.click();
                  window.URL.revokeObjectURL(elink.href); // 释放URL 对象
                  document.body.removeChild(elink);
                  this.loadingState.downloadSimpleLoading = false
              } else {
                  // IE10+下载
                  navigator.msSaveBlob(blob, fileName);
              }
              return that.$notify.success({
                  title: '成功',
                  message: "获取成功！"
              })
          }).catch(() => {
            this.loadingState.downloadSimpleLoading = false
          })
      },
      delTask(taskId){
          console.log("删除任务=====》");
          const that = this;
          delTask(taskId).then(res=>{
              if (res.status !== 200) return that.$notify.error({
                  title: '失败',
                  message: "删除失败！稍后再试"
              });
              this.findTaskList();
              return that.$notify.success({
                  title: '成功',
                  message: "删除成功！"
              })
          })
      },
      back() {
          this.$router.back();
      },
      handleFullScreen() {
          let element = document.documentElement;
          if (this.fullscreen) {
              if (document.exitFullscreen) {
                  document.exitFullscreen();
              } else if (document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
              } else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
              } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
              } else {
                  if (element.requestFullscreen) {
                      element.requestFullscreen();
                  } else if (element.webkitRequestFullScreen) {
                      element.webkitRequestFullScreen();
                  } else if (element.mozRequestFullScreen) {
                      element.mozRequestFullScreen();
                  } else if (element.msRequestFullscreen) {
                      // IE11
                      element.msRequestFullscreen();
                  }
              }
          }
      }
  }
}
</script>

<style lang='less' scoped>
#task_container {
  // background-color: aquamarine;
  height: 100%;
  .el-card {
      .executedTask{
          margin-bottom: 20px;
      }
    .m-card {
      width: 220px;
      .task-action {
        font-size: 50px;
        width: 100%;
        height: 250px;
        border-bottom: 2px rgb(224, 15, 137) solid;
        margin: auto;
        div{
          margin-top: 10px;
          font-size: 20px;
        }
      }
      .el-divider--horizontal {
        margin: 10px 0;
      }
      .edit-button {
        display: flex;
        justify-content: space-between;
        .button {
          width: auto;
          border-radius: 0;
          padding: 6px;
        }
      }
    }
    .taskHandle{
      height: 350px;
    }
    .taskInfoTitle{
      font-size: 18px;
      border-radius: 2px;
      box-shadow: 0 1px 2px #888888;
      padding: 5px;
      margin: 5px 0;
      width: 100%;
      display:inline-block;
      background-color: #00c8cf;
      color: white
    }
    .taskInfoSubTitle{
      /*display: inline-block;*/
      margin: 10px 0;
      padding: 5px 15px;
      border-left: 5px solid #2e9dfc;
    }
    .taskInfoItem{
      /*display: block;*/
      padding: 5px 20px;
      background-color: #eeeeee;
      border-radius: 10px;
      margin: 10px 20px;
    }
  }
  .m-marginTop {
    margin-top: 5px;
  }
  .m-marginRL {
    height: 98%;
    margin: 0 80px;
  }
  .m-boxcenter {
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .m-textcenter {
    text-align: center;
  }
  .code {
    font-family: Monaco, Consolas, Andale Mono, monospace;
    margin: 10px 0;
    line-height: 15px;
    font-size: 10px;
    padding: 8px;
    border-radius: 5px;
    color: white;
    background-color: rgb(23, 65, 110);
    height: 245px;
    overflow-y: scroll;
  }
  .jupyterFrame {
    height: 900px;
  }
  .itemChildBox{
    height: 100px;
    overflow: auto;
  }
  .itemChildBox::-webkit-scrollbar {
    width: 6px;
  }
  .itemChildBox::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(5, 170, 182, 0.4);
  }
  .el-dropdown {
  }
}
  .modelDownload{
    width: 18%;
  }
</style>
