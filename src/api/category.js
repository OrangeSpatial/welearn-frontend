import { service } from "./url.js"



export function checkName(name) {
  return service.get("/dlType/findByName/" + name);
}

export function getDLtype() {
  return service({
    url: '/dlType/findAll',
    method: "get"
  });
}

export function getImage() {
    return service({
      url: "/imageSetCategory/getCategoryImage",
      method: "get"
    });
  }

  export function findFirst() {
    return service({
      url: "/imageSetCategory/findFirst",
      method: "get"
    });
  }

  export function findSecondByFirst(first) {
    return service({
      url: '/imageSetCategory/findSecond/' + first,
      method: "get"
    });
  }



  export function findThirdByFirstAndSecond(first,second) {
    return service({
      url: '/imageSetCategory/findThird/' + first + '/' + second,
      method: "get"
    });
  }

  export function getIdByFirstAndSecond(first,second) {
    return service({
      url: '/imageSetCategory/getIdBytypes/first/' + first + '/second/' + second,
      method: "get"
    });
  }

  export function getIdByFirstAndSecondAndThird(first,second,third) {
    return service({
      url: '/imageSetCategory/getIdBytypes/first/' + first + '/second/' + second + '/third/' + third,
      method: "get"
    });
  }


  export function insertType(data) {
    return service({
      url: "/dlType/insert",
      method: "post",
      data: data
    });
  }

  export function insertCategory(data) {
    return service({
      url: "/imageSetCategory/insert",
      method: "post",
      data: data
    });
  }

  export function categoryUpload (form) {
    return service({
      url: '/imageSetCategory/upload',
      method: 'post',
      data: form
    })
  }
