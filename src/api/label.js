import { service } from "./url.js"


  export function getLabelNameBySetId(imageSetId) {
    return service({
      url: "/label/getLabelNameAndStyles/"+ imageSetId,
      method: "get"
    });
  }

  export function DownloadLabel(imageSetId) {
    return service({
      url: "/label/zip/" + imageSetId,
      method: "get",
      config: {
        responseType: 'blob'
      }
    });
  }

  export function uploadLabel(data) {
    return service({
      url: "/label/upload",
      method: "post",
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data' // 文件上传时的格式
      }
    });
  }
