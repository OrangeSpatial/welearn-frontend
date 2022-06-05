import { service } from "./url.js"


  export async function getImageUrlsBySetId(imageSetId) {
  const res = await service.get("/image/getImageUrls/"+ imageSetId)
    return res
  }


  export function DownloadImage(imageSetId) {
    return service({
      url: "/image/zip/"+imageSetId,
      method: "get",
      // config: {
      //   responseType: 'blob'
      // },
      responseType: 'blob'
    });
  }

  export function uploadImage(data) {
    return service({
      url: "/image/upload",
      method: "post",
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data' // 文件上传时的格式
      }
    });
  }

  // export function uploadImage(data, imageProgress) {
  //   return service({
  //     url: "/image/upload",
  //     method: "post",
  //     data: data,
  //     headers: {
  //       'Content-Type': 'multipart/form-data' // 文件上传时的格式
  //     },
  //     onUploadProgress: imageProgress
  //   });
  // }

  export function minioUpload(data) {
    return service({
      url: "/image/minio",
      method: "post",
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data' // 文件上传时的格式
      }
    });
  }


  export function minioDownload() {
    return service({
      url: "/image/download",
      method: "post",
      responseType: 'arraybuffer'
    });
  }

  export function findImageByTypeAndTag(type,tag) {
    return service({
      url: '/image/getImageUrlsByTagOrType/' + type + '/' + tag,
      method: "get"
    });
  }

  export function findImageByType(dlType) {
    return service({
      url: '/image/getImageTagsByType/' + dlType,
      method: "get"
    });
  }
