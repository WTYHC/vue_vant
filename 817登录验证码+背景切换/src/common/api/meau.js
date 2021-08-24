import { request } from "../config/request.js"; //公共封装请求类

//查询菜单列表
export function getMeauList(params) {
  return request({ url: '/manage/menu',method: 'post',data: params})
}

// 添加、编辑菜单
export function menuSave(params) {
  return request({ url: '/manage/menuSave',method: 'post',data: params})
}

// 删除菜单列表的数据
export function menuDel(params) {

  return request({ url: '/manage/menuDel',method: 'post',data: params})
}