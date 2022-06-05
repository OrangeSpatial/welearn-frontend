import { service } from "./url.js"


  export function insertSimple(data) {
    return service({
      url: '/simple/insert',
      method: "post",
      // dataType: "json",
      // contentType:"application/json",
      data: data
    });
  }

export function enhanceSimple(data) {
  return service({
    url: '/simple/enhance',
    method: "post",
    data: data
  });
}


  export function findSimpleByUser(userId) {
    return service({
      url: '/simple/findAllByUserId/'+userId,
      method: "get"
    });
  }

export function findSimpleByUserAndType(userId,dlType) {
  return service({
    url: '/simple/findAllByUserIdAndType/'+userId+'/'+dlType,
    method: "get"
  });
}

  export function delSimpleById(id) {
    return service({
      url: '/simple/deleteById/'+id,
      method: "delete"
    });
  }
