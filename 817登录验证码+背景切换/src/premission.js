import router from './router'
import { getMeauList } from "./common/api/meau.js";
import VueCookie from 'vue-cookie'
//导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
let child = [];
let meauList;


// 从本地获取菜单数据
meauList = localStorage.getItem("meauList");
// console.log(meauList);
if (meauList != null) {
    meauList = JSON.parse(meauList);
    // console.log(meauList);                        
} else {
    getMeauList().then(res => {     
        console.log(res);
        try {
            meauList = res.data;
            // addRoutes(meauList) //调用函数
            localStorage.setItem("meauList", JSON.stringify(meauList)); //转换成json字符串，存储到本地
        }
        catch (err) {
           console.log(err);
        }
    });
    //  console.log(meauList);

}

// 实现无限极路由
function addRoutes(meauList) {
    // console.log(meauList);
    meauList.forEach((item, index) => {
        
        // console.log(item);
        // 如果一级等于# 或是空  那么存在下级菜单
        if (item.url == "#" || item.url == "" || item.url == null ) {
            // 先判断子菜单是否有数据
            // 不为空 再调用此函数 
            // console.log(item.submenu);
            if(item.submenu!=undefined){
                if (item.submenu.length > 0  ) {
                    addRoutes(item.submenu);
                }
            }
           
        } else {

            let obj = {
                path: item.url,
                name: item.url.substr(1),
                component: item.compont_path
            }
            child.push(obj)
        }
    })

}
//自动生成路由

function createRoute(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].component) return
        //自动生成component
        let componentFun = import(`./views${arr[i].component}.vue`)
        arr[i].component = () => componentFun
    }
    return arr;
}

try {
    addRoutes(meauList) //调用函数
    let baseRoutes = {
        path: '/',
        name: '',
        redirect: "/user",
        component: (resolve) => require(['./views/layout.vue'], resolve),
        children: createRoute(child)
    }
    
    router.addRoute(baseRoutes) //webpack 3.x 
    //router.addRoutes(baseRoutes); //webpack 2.x
} catch (error) {
    console.log(error);
    
}


// 设计免登录页面的路径
var noLogin = ['/login','/error'];

console.log(child);
var path_url = []; //用来保存菜单栏界面地址
for (let index = 0; index < child.length; index++) {
    path_url[index] = child[index].path; //将除登录地址外的菜单路由赋值
    // console.log( path_url[index]);
    
}
// console.log("1111");
// path_url.push("/")
console.log(path_url);

//路由守卫，权限管理, 拦截器
router.beforeEach((to, from, next) => {
    NProgress.start()
    // NProgress.set(0.4) 
    console.log(to.path);

    //先从cookie中获取token值  
    var token = VueCookie.get('token');
    // console.log(token);

    // 先判定当前界面是否在免登录界面
    if(noLogin.indexOf(to.path)==-1){ //当前界面不在免登录范围内
        
        //判断token中是否有值 （或者是否过期）
        if(token==null) {  next({path: '/login' })} //没有值跳转到登录界面
        else{   //有值 证明之前已经登录过 且token值在cookie中没有过期
          
            // 判定当前的网址是否存在
            if(path_url.indexOf(to.path)==-1){// 不存在跳转404 
                // 注：需要将404的界面加到免登录数据中 否则会造成死循环 没法进行跳转
                next({path: '/error' });
            }else{   //当前网址存在 直接跳转
                next();
            }
        }
    }else{
        next();//在免登录范围直接执行
    }
    
})
router.afterEach(() => {
    NProgress.done()
})
