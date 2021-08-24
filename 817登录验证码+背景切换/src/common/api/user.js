import { request } from "../config/request.js"; //公共封装请求类

//查询会员列表
export function getUserList(params) {
  return request({ url: '/manage/userlist',method: 'post',data: params})
}

//添加/编辑 数据 带ID这是编辑
export function userSave(params) {
  return request({ url: '/manage/userSave',method: 'post',data: params})
}


//添加数据
export function delUser(params) {
  return request({ url: '/manage/userDel',method: 'post',data: params})
}





