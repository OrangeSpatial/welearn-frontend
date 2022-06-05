import { service } from "./url.js"
import qs from "qs";

export function login(data) {
  return service({
    url: "/login",
    method: "post",
    data: qs.stringify(data),
  });
}

export function isRegister(data) {
  return service({
    url: "/user/register/byusername/"+data,
    method: "get"
  });
}

export function register(data) {
  return service({
    url: "/user/register/one",
    method: "post",
    data: data,
  });
}


export function getAllUsers() {
  return service({
    url: "/user/all",
    method: "get",
  });
}

export function getUserByName(username) {
  return service({
    url: '/user/byUsername/' + username,
    method: "get"
  });
}

export function update(data) {
  return service({
    url: "/user/update",
    method: "post",
    data: data,
  });
}

export function insert(data) {
  return service({
    url: "/user/insert",
    method: "post",
    data: data,
  });
}

export function delUser(userId) {
  return service({
    url: '/user/del/' + userId,
    method: "get"
  });
}
