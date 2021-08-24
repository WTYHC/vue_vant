import axios from "axios";
export function request(config) {

    const instance1 = axios.create({
      baseURL:'http://localhost:3000',
      timeout:5000
    })
    //  响应拦截
    instance1.interceptors.response.use(config =>{
        return config.data
      },err =>{
        console.log(err);
      })

//  发送真正的网络请求
    return instance1(config)
}
