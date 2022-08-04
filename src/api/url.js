import router from "../router";
import axios from "axios";
// import qs from "qs";

export const baseURL = "http://localhost:8005/";
// export const baseURL = "http://202.114.114.19:8005/";
export const JUPYTERURL = "http://202.114.114.21:8002/";
// 创建axios实例
const service = axios.create({
  baseURL: baseURL
});

// service.defaults.headers.post['Content-Type'] = 'application/x-
// www-form-urlencoded'
// service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios 请求拦截
service.interceptors.request.use(
  (config) => {
    // console.log(config);
    var Authorization = window.sessionStorage.getItem("Authorization");
    const reg = new RegExp("^((/user/register)|(/hello)|(/dlType/findAll)|(/image/getImageUrlsByTagOrType)).*");
    if (Authorization === null && !reg.test(config.url)) {
      router.push("/login").catch((err) => err);
    }
    config.headers.Authorization = Authorization;
    if (
      config.headers["Content-Type"] === "multipart/form-data" ||
      config.method !== "post"
    ) {
      return config;
    }
    // config.data = qs.stringify(config.data);
    // console.log(config.data);
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { service };
