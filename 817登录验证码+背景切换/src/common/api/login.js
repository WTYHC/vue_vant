// import {request} from "../../../src/common/api/request";
// export function getUser(username,passwd) {
//   return request({
//     url:'/user',
//     params: { username: username, passwd: passwd }
    
//   })
// }

import { request } from "../config/request.js"; //公共封装请求类

//查询菜单列表
export function getUser(params) {
  return request({ url: '/manage/login',method: 'post',data: params})
}