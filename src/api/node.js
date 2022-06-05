import { service } from "./url.js"

export function findSystem() {
    return service({
      url: '/system/findAll',
      method: "get"
    });
  }

  export function findAll() {
    return service({
      url: '/node/findall',
      method: "get"
    });
  }

  export function findById(nodeId) {
    return service({
      url: '/node/find/' + nodeId,
      method: "get"
    });
  }

//   添加，修改，删除（假）
  export function insert(data) {
    return service({
      url: '/node/insert',
      method: "post",
      data: data
    });
  }
