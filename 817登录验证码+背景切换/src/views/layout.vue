<template lang="">
  <div>
    <el-container style="height: 600px; ">
      <el-aside :width="isCollapse ? '62px' : '200px'">
        <div id="aside_meau">
          <el-card id="aside_title" shadow="never">
            <img
              v-if="isCollapse"
              src="../assets/logo2.png"
              width="25px"
              style="margin-top: 12px;"
            />
            <span v-else style="text-align: center; ">
              商城后台管理系统
            </span>
          </el-card>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#2f4050"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse-transition="true"
            @select="handleSelect"
            :collapse="isCollapse"
          >
            <!-- <div id="aside_title">商城后台管理系统</div> -->
            <!-- <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item> -->

            <template v-for="(item, index) in meauList">
              <el-submenu
                class="submenu"
                :key="index"
                :index="item.title"
                v-if="item.submenu != null"
              >
                <template slot="title">
                  <i class="el-icon-message"></i>
                  <span slot="title">{{ item.title }}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item, index) in item.submenu"
                    :key="index"
                    :index="item.url"
                    >{{ item.title }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item v-else :key="index" :index="item.url">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header height="50px">
          <el-row>
            <el-col :span="12">
              <div class="grid-content ">
                <div
                  class="icons"
                  style="float: left;border:none;font-size:20px;line-height: 50px;"
                  @click="toggleCollapse"
                >
                  <i class="el-icon-s-unfold" v-if="isCollapse"></i>
                  <i class="el-icon-s-fold" v-else></i>
                </div>

                <el-breadcrumb
                  separator="/"
                  style="line-height: 50px;margin-left:40px"
                >
                  <el-breadcrumb-item :to="{ path: '/' }"
                    >首页</el-breadcrumb-item
                  >
                  <el-breadcrumb-item
                    v-for="(item, index) in breadcrumb_item"
                    :key="index"
                    >{{ item }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content ">
                <el-dropdown trigger="click" style="float: right;">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-lock"
                      >修改密码</el-dropdown-item
                    >
                    <el-dropdown-item icon="el-icon-delete"
                      @click.native="clearData">清除缓存</el-dropdown-item
                    >
                    <el-dropdown-item icon="el-icon-back" @click.native="exit"
                      >退出登录</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <div style="float: right;">{{ username }}</div>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <div id="tag">
            <el-tag color="#FFF" style=" color: #9197a4;">首页</el-tag>
            <el-tag
              color="#FFF"
              :key="index"
              v-for="(tag,index) in dynamicTags"
              closable
              type= 'info'
              :disable-transitions="false"
              @close="TaghandleClose( index)"
              @click = "Tagchange(index)"
              :class="isTagurl == tag.url ? 'istag':'' "
            >
          
              {{ tag.tagName }}
            </el-tag>
          </div>

          <router-view class="main_content"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getMeauList } from "../common/api/meau.js";

// import {mapActions} from 'vuex' //全局状态的 
export default {
  data() {
    return {
      activeIndex: "",
      meauList: [],
      isCollapse: false,
      breadcrumb_item: [],
      username: "",
      dynamicTags: [],
      isTagurl:"",
    };
  },

     
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    
    // 点击侧边栏改变界面
    handleSelect(key) {
      this.$router.push( key);
      this.activeIndex = key;
      // console.log(key, keyPath);
      this.navList(key); //调用面包屑方法
      
      this.isTagurl = key; //设计当前tag 是哪个路径
      // console.log( this.isTagurl)


      // 判断是否为空 为空直接调用方法
      if (this.dynamicTags==null) {
        this.tagList(key) //调用导航标签的方法
        
      }else{
        var flag = false
         // 添加tag标签之前先判断dynamicTags数组里Tag标签是否存在
        this.dynamicTags.forEach(item=>{
          if (item.url == key){  //存在不需要调用方法
               flag = true;
          }
        })
        if(!flag){
          this.tagList(key)
        }
      }
     
     
    },
    
    // 侧边栏伸缩
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    
    //面包屑数据
    navList(key) {
      var list = [];
      this.meauList.forEach(item => {
        // console.log(item);
        // console.log(item.submenu);
        if (item.submenu != undefined) {
          item.submenu.forEach(item2 => {
            //  console.log(item);
            if (item2.url == key) {
              // console.log(item.title);
              // console.log(item2.title)
              list[0] = item.title;
              list[1] = item2.title;
            }
          });
        } else {
          if (item.url == key) {
            list[0] = item.title;
          }
        }
      });
      // console.log(list);
      this.breadcrumb_item = list;
      // 将数据存储到本地，刷新后保持面包屑不变
      // localStorage.setItem("navlist", list);
    },

    // tag标签数据
    tagList(key){
      var  _that = this;
      this.meauList.forEach(item => {
        // console.log(item);
        // console.log(item.submenu);
        // var that = this;
        if (item.submenu != undefined) {
          item.submenu.forEach(item2 => {

            if (item2.url == key) {
               var obj = {url:key,tagName:item2.title}
              _that.dynamicTags.push(obj)

            }
          });
        } else {
          if (item.url == key) {
            var obj = {url:key,tagName:item.title}
            _that.dynamicTags.push(obj) ;
          }
        }
      });
      // console.log( _that.dynamicTags);
      // this.breadcrumb_item = list;
      // 将数据存储到本地
      // localStorage.setItem("tagList",JSON.stringify(this.dynamicTags) );
    },
    
    // Tag标签点击事件
    Tagchange(index){
      // console.log(index);
      var key = this.dynamicTags[index].url;
      console.log(key);
      this.handleSelect(key);
      
    },

    //移除tag标签方法
    TaghandleClose(index) {
      // 移除index 对应的tag标签
      var  newList = this.dynamicTags.splice(index, 1);
      // console.log(newList[0].url);
      // console.log(newList[0].url==this.isTagurl);

      // 判断当前删除的是不是当前响应的  如果是赋值dynamicTags数组中最后一个元素
      if(newList[0].url==this.isTagurl){
         var key = "";
         if(this.dynamicTags ==""){
           key="/user"
         }else{
          //  获得tag数组中最后一个元素
           key = this.dynamicTags[this.dynamicTags.length-1].url;
         }
         this.handleSelect(key);
      }
     
    },
    //  清除缓存数据
    clearData(){
       // 清除缓存
      localStorage.removeItem('meauList');
      //重新请求一下菜单数据
      getMeauList().then(res => {
        // console.log(res.data);
        this.meauList = res.data;
        //  console.log(this.meauList);
        localStorage.setItem("meauList", JSON.stringify(this.meauList)); //转换成json字符串，存储到本地
      });

      // console.log(this.meauList);
      
      

    },
    // 退出登录
    exit() {
      // 清除缓存
      // localStorage.clear();
      this.clearData();
      // 清除cookie中的数据
      this.$cookie.delete("token");
      this.$cookie.delete("manager");
      // 跳转登录界面
      this.$router.push("/login");
    },

    // ...mapActions(['getData']),
    // handle(){
    //    this.$store.dispatch('getData')
    // },
  },

  // 加载完成后执行
  mounted() {
    // 先检查本地是否有数据
    var localData = localStorage.getItem("meauList");
    this.meauList = JSON.parse(localData);
    this.meauList.forEach((item,index)=>{
        // console.log(item.title);
        if (item.title=="") {
           this.meauList.splice(index,1);
        }
        
    })
     
    // //在调用commit函数 触发mutations时携带参数
    // this.$store.commit('getMeau',this.meauList) 
    console.log(this.meauList);
  

    // console.log(this.$route);
    // 获取当前的路径
    this.activeIndex = this.$route.path;
    // this.activeIndex = "/" + this.$route.path.split("/")[2];

    // 直接调用侧边栏的选择方法
    this.handleSelect(this.activeIndex);

    // 监听界面大小的变化
    var screenWidth = document.body.clientWidth;
    // var screenHeight = document.body.clientHeight;
    if(screenWidth<=1000){
          this.isCollapse = true;
     }else{
        this.isCollapse = false;
     }    
    window.onresize = () => {
        return (() => {
          screenWidth = document.body.clientWidth;
          // screenHeight = document.body.clientHeight;
          if(screenWidth<=1000){
          this.isCollapse = true;
          }else{
            this.isCollapse = false;
          }
        })();
    };
     
   
  },
  created() {
    // var username = localStorage.getItem("username");
 
    // 从cookie中取出数据
    var manager  = this.$cookie.get("manager")
    // console.log(manager);
    this.username =  manager;
   
  }
};
</script>
<style>
.main_content{
    background-color: #FFF;
    margin-top: 10px;
    padding: 20px;
  
}
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 50px;
}

#aside_title {
  height: 50px;
  line-height: 50px;

  /* position: fixed; */
  top: 0;
  /* left: 0; */

  background: #2f4050;
  color: #fff;
  z-index: 10;
  border: none;
  text-align: center;
}

.el-card__body {
  padding: 0 !important;
}

.el-aside {
  background-color: #2f4050;
  /* color: #333; */
  text-align: center;
  line-height: 200px;
  transition: 0.3s;  
  height: 100vh;
}

/* #aside_meau {
  margin-top: 50px;
  
} */

.el-menu {
  border-right: none;
  text-align: left;
  /* width: 200px;   */
}

.el-menu-item-group__title {
  padding: 0;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
 
  white-space: nowrap;
 
  overflow-y: scroll !important;


}

.el-container.is-vertical {
    flex-direction: column;
    height: 100vh;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-row {
  height: 100%;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 50px;
  line-height: 50px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

body {

  margin: 0;
  padding: 0;
  min-width: 1000px;  
  /* overflow-x: hidden; */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: auto;
  height: 100%;
}

.el-menu-vertical {
  border: none;
}

/* Tag标签 */
.el-tag + .el-tag {
  margin-left: 10px;
  color: #9197a4;
 
}
.el-tag:hover {
        cursor: pointer;
        color: #409EFF;
}
#tag {
  text-align: left;
 
}
.istag{
  color:#409eff !important;
}
</style>
