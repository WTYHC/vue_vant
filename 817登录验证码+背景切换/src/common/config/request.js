import axios from 'axios'
import qs from 'qs'
import {
  Message,
 
} from 'element-ui'
// import router from './router'

//请求地址
axios.defaults.baseURL = 'http://shop.ueoa.net'
//设置超时时间
axios.defaults.timeout = 5000
// post请求头

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withcredentials = true

//请求拦截(请求发出前处理请求)
axios.interceptors.request.use((config) => {
  /*const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers['Authorization'] = token
  }*/
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器（处理响应数据）
axios.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    Message({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 2000
    })
    return Promise.reject(error);
  }
);

// 封装get方法
function get(url, data) {
  return new Promise((resolve, reject) => {
    axios.get(url, qs.stringify(data)).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data);
    })
  });
}

// 封装post方法
function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params)).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data);
    })
  });
}

// 封装post方法
function del(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data);
    })
  });
}

// 封装post方法
function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data);
    })
  });
}

//对外接口 url：代表请求地址  method：请求方法，data：请求参数据
export function request({url,method,data}) {
  if (method == 'get') {
    return get(url, data);
  } else if (method == 'post') {
    return post(url, data);
  }else if (method == 'delete') {
    return del(url, data);
  }else if (method == 'put') {
    return put(url, data);
  }

}
//默认的外部接口
export default request
