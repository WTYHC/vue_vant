<template lang="">
  <div id="login">
      <vue-particles
      class="login-bg"
    color="#39AFFD"
    :particleOpacity="0.7"
    :particlesNumber="100"
    shapeType="circle"
    :particleSize="4"
    linesColor="#8DD1FE"
    :linesWidth="1"
    :lineLinked="true"
    :lineOpacity="0.4"
    :linesDistance="150"
    :moveSpeed="3"
    :hoverEffect="true"
    hoverMode="grab"
    :clickEffect="true"
    clickMode="push"
    >
    </vue-particles>
    

    <div id="login_form">
          <div class="title">商城后台管理系统</div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      v-loading="loading"
    >
      <el-form-item prop="username">
        <el-input
          size="small"
          prefix-icon="el-icon-user"
          v-model="ruleForm.username"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
          size="small"
          prefix-icon=" el-icon-lock"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%" size="small" type="primary"
        @click="submitForm('ruleForm')">登录</el-button
        >
      </el-form-item>
    </el-form>
    </div>

  </div>
</template>

<script src="https://libs.baidu.com/jquery/1.11.3/jquery.min.js"></script>
<script>


// 引用封装好的请求用户数据的接口
import {getUser} from '../../common/api/login.js';


export default {
  name: "login",

  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        username: "",
        pass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateName, trigger: "blur" }]
      },
      loading:false,
    };
  },
  methods: {
    Login(username,passwd){
      var _that = this;
      getUser(username,passwd).then(res=>{
       
        // console.log(res[0].id);
         if(res.length>0){
          _that.loading = false;
            //  将用户的id存到本地
             localStorage.setItem("username",res[0].username);
                this.$message({
                message: '登录成功！正在跳转...',
                type: 'success',
                duration:2000,
              });
              setTimeout(function() {
              _that.$router.push({
                'path': '/index'
              }); //路由跳转用户中心
            },2000);
         }else{
          _that.loading = false;
          this.$message({
                message: '登录失败,用户名或密码错误！',
                type: 'error'
            });
         }
      });
     
       
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
       
          this.loading = true;
          // 调用登录方法
           this.Login(this.ruleForm.username,this.ruleForm.pass);
          
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created(){

  },
};


</script>
<style>
  body{
 
    margin: 0;
    padding: 0;
  }
  #login{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    /* color: #cccccc;  */
    /*如果想做背景图片 可以给标签一个class 直接添加背景图*/
    /* position: relative; */
  }
  .login-bg{
    width: 100%;
    height: 100%;
    background: #3E3E3E;
  }
#login_form {
  z-index: 10;
  height: 240px;
  width: 260px;
  background: rgba(228, 230, 230, 0.938);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 0 40px;
}
.title {
  font-weight: 600;
  font-size: 18px;
}
.title,
.el-form-item {
  margin: 15px 0;
}
</style>
