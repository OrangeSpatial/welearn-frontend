import { service } from "./url.js"

export function findAll() {
    return service({
      url: "/model/findAll",
      method: "get"
    });
  }

export function insertModel(data) {
  return service({
    url: "/model/insert",
    method: "post",
    data: data
  });
}

  export function findAllByUserId(userId) {
    return service({
      url: '/model/findByUserId/' + userId,
      method: "get"
    });
  }

  export function insertAndUpload(data, modelProcess) {
    return service({
      url: '/model/upload',
      method: "post",
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data' // 文件上传时的格式
      },
      onUploadProgress: modelProcess
    });
  }

export function uploadModelFiles(data, modelProcess) {
  return service({
    url: '/model/upload/modelFile',
    method: "post",
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data' // 文件上传时的格式
    },
    onUploadProgress: modelProcess
  });
}

export function saveTaskModel(data) {
  return service({
    url: '/model/saveModel',
    method: "post",
    params: data
  });
}

  export function findAllByUserIdAndType(userId,taskType) {
    return service({
      url: '/model/userIdAndDLType/' + userId + '/' + taskType,
      method: "get"
    });
  }

  export function findAllByUserIdNotAndType(userId,taskType) {
    return service({
      url: '/model/userIdNotAndDLType/' + userId + '/' + taskType,
      method: "get"
    });
  }

export function findModelById(modelId) {
  return service({
    url: '/model/download/' + modelId,
    method: "get"
  });
}

export function findChildModelById(modelChildId) {
  return service({
    url: '/model/downloadChild/' + modelChildId,
    method: "get"
  });
}
