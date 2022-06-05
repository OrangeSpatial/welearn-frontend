import { service } from "./url.js"

export function imageUpload (form) {
  return service({
    url: '/image/upload',
    method: 'post',
    data: form
  })
}

export function labelUpload (form) {
  return service({
    url: '/label/upload',
    method: 'post',
    data: form
  })
}

export function modelUpload (form) {
  return service({
    url: '/model/upload',
    method: 'post',
    data: form
  })
}

export function categoryUpload (form) {
  return service({
    url: '/imageSetCategory/upload',
    method: 'post',
    data: form
  })
}

export function imageDown (imageSetId) {
  return service({
    url: '/image/zip/' + imageSetId,
    method: 'get',
    responseType: 'blob'
  })
}
