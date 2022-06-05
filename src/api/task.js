import { service } from "./url.js"



  export function insert(data) {
    return service({
      url: '/task/insert',
      method: "post",
      data: data
    });
  }

  export function findByUserId(userId) {
    return service({
      url: '/task/findTasks/' + userId,
      method: "get"
    });
  }

  export function findByUserIdAndStatus(userId, status) {
    return service({
      url: '/task/findTasks/' + userId + '/' + status,
      method: "get"
    });
  }

  export function findTasksByOrder(taskId, nodeId) {
    return service({
      url: '/task/findTasksByOrder/' + taskId + '/' + nodeId,
      method: "get"
    });
  }

//   修改任务状态  ==》 请求类型需要更新
  export function updateStatus(taskId, status) {
    return service({
      url: '/task/status/' + taskId + '/' + status,
      method: "get"
    });
  }

// '/task/del_false/' + taskId,
  export function delTask(taskId) {
    return service({
      url: '/task/del_true/' + taskId,
      method: "get"
    });
  }

  export function prepareTaskForWin(data) {
    return service({
      url: '/task/taskPrepareForWin',
      method: "post",
      params: data
    });
  }

  export function prepareTaskForLinux(data) {
    return service({
      url: '/task/taskPrepareForLinux',
      method: "post",
      params: data
    });
  }

  export function finishTaskForWin(data) {
    return service({
      url: '/task/taskFinishForWin',
      method: "post",
      params: data
    });
  }

  export function finishTaskForLinux(data) {
    return service({
      url: '/task/taskFinishForLinux',
      method: "post",
      params: data
    });
  }

  export function downloadResult(taskId) {
    return service({
      url: '/task/result/' + taskId,
      method: "get"
    });
  }

export function downloadEnhancedSet(taskId) {
  return service({
    url: '/task/downloadEnhancedSet/' + taskId,
    method: "get",
    responseType: 'blob'
  });
}


export function uploadEnhanceImageSet(data) {
  return service({
    url: '/task/enhanced',
    method: "get",
    params: data
  });
}
