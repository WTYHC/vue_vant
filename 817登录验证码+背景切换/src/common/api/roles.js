import { request } from "../config/request.js"; //公共封装请求类

//查询角色列表
export function rulesList(params) {
  return request({ url: '/manage/rulesList',method: 'post',data: params})
}


//添加、编辑角色权限（有id 时是编辑）
export function rulesSave(params) {
  return request({ url: '/manage/rulesSave',method: 'post',data: params})
}

// 删除对应的角色
export function rulesDel(params){
  return request({ url: '/manage/rulesDel',method: 'post',data: params})
}