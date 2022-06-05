
import { service } from "./url.js"



export function findByType(typeName) {
    return service({
      url: "/imageSet/findByType/" + typeName,
      method: "get"
    });
  }

export function findAllByAudit(audit) {
  return service({
    url: "/imageSet/findall/"+audit,
    method: "get"
  });
}

export function audit(data) {
  return service({
    url: "/imageSet/audit",
    method: "post",
    params: data
  });
}

  export function getByUser(userId) {
    return service({
      url: "/imageSet/findByUserId/" + userId,
      method: "get"
    });
  }

  export function getByUserAndType(userId, taskType) {
    return service({
      url: '/imageSet/findByUserId/' + userId + '/' + taskType,
      method: "get"
    });
  }

  export function getByUserNotAndType(userId, taskType) {
    return service({
      url: '/imageSet/findByUserIdNot/' + userId + '/' + taskType,
      method: "get"
    });
  }

  export function findImageSet(type, index = '0') {
    return service({
      url: '/imageSet/findByType/' + type + '/' + index,
      method: "get"
    });
  }

  export function insert(data) {
    return service({
      url: "/imageSet/insert",
      method: "post",
      data: data
    });
  }
  
  export function delImageSet(imageSetId) {
    return service({
      url: "/imageSet/del/"+imageSetId,
      method: "delete"
    });
  }
  