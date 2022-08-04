import { service } from "./url.js"

export function uploadRSImage(data, modelProcess) {
    return service({
        method: "post",
        url: '/rsImage/upload',
        data,
        headers: {
            'Content-Type': 'multipart/form-data' // 文件上传时的格式
        },
        onUploadProgress: modelProcess
    })
}