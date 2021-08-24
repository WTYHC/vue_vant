let routes = [

    {
      path: '/login',
      name: 'login',
      component: 'login/index'
    },
    {
      path: '/',
      name: 'Layout',
      component: 'layout',
      redirect:{
        name:"layout"
      },
      
    },
    
    
    ]
    
    let getRoutes = function () {
      createRoute(routes);
      return routes
    }
    //自动生成路由
    function createRoute(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].component) return
        //自动生成component
        let componentFun = import(`../../views/${arr[i].component}.vue`)
        console.log(componentFun);
        arr[i].component = () => componentFun
        //根据数组循环children子页面
        if (arr[i].children && arr[i].children.length > 0) {
          createRoute(arr[i].children);
        }
      }
    }
    //返回调用
    export default routes
    