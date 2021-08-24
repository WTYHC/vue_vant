<template lang="">
  <div id="login" :style="{'background-image':'url('+coverImgUrl+')', backgroundSize:'100% 100%', backgroundRepeat: 'no-repeat'}">
    <vue-particles

      class="login-bg"
      color="#FFF"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#ccc"
      :linesWidth="0"
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
        <el-form-item style="text-align: left;" prop="code">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input
                type="text"
                v-model="ruleForm.code"
                autocomplete="off"
                size="small"
                prefix-icon=" el-icon-lock"
                placeholder="验证码"
              ></el-input
            ></el-col>
            <el-col :span="10">
              <!-- <el-image
            style="
                height: 32px;
                margin-top: 3px;
                float: right;
                border-radius: 4px;"
            :src="imgurl"
            @click.native="changeimg"></el-image> -->

              <!-- <Verify :showButton="false" :type="1"></Verify> -->
              <span @click="refreshCode"
                ><s-identify :identifyCode="identifyCode"></s-identify
              ></span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item size="small" style="text-align: left;">
          <el-checkbox v-model="checked" @change="remCheck"
            >记住密码</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button
            style="width:100%"
            size="small"
            type="primary"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script src="https://libs.baidu.com/jquery/1.11.3/jquery.min.js"></script>
<script>
// 引用封装好的请求用户数据的接口
import { getUser } from "../../common/api/login.js";

import Verify from "vue2-verify"; //引入验证码插件

import SIdentify from "../../components/identify.vue"; //验证码组件引入

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

    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      const newVal = value.toLowerCase(); //转成小写
      const identifyStr = this.identifyCode.toLowerCase();
      if (newVal === "") {
        callback(new Error("请输入验证码"));
      } else if (newVal !== identifyStr) {
        console.log("validateVerifycode:", value);
        callback(new Error("验证码不正确!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        username: "",
        pass: "",
        code: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateName, trigger: "blur" }],
        code: [
          { required: true, trigger: "blur", validator: validateVerifycode }
        ]
      },
      loading: false,
      checked: false,
      // imgurl:"http://shop.ueoa.net/index/captcha/h/40/w/120/bc/1a78c2/c/ffffff/random/0.9252404526941604"
      identifyCodes: "3456789ABCDEFGHGKMNPQRSTUVWXY",
      identifyCode: "",
      bg: [
      require('../../assets/login9.jpg') ,
      require('../../assets/login8.jpg') ,
      require('../../assets/login3.jpg') ,
      ],
      coverImgUrl: require('../../assets/login.jpg')
    };
  },

  components: { SIdentify },

  methods: {
    Login(userdata) {
      var _that = this;
      // console.log(userdata)
      let param = {
        name: userdata.username,
        password: userdata.pass
      };
      // console.log(param)
      getUser(param).then(res => {
        console.log(res);
        if (res.code == 200) {
          _that.loading = false;
          //  将用户的id存到本地
          //  localStorage.setItem("username",res[0].username);
          //使用cookie进行存储
          var millisecond = new Date().getTime();
          console.log(_that.checked);
          if (_that.checked) {
            var expiresTime = new Date(millisecond + 60 * 1000 * 60 * 24); //设置过期时间为1天
            // console.log(millisecond)
          } else {
            var expiresTime = new Date(millisecond + 60 * 1000 * 5);
          }

          // console.log(millisecond)
          // console.log(expiresTime)
          var token = res.data.token;
          var manager = res.data.manager;

          this.$cookie.set("token", token, { expires: expiresTime }); //存储5分钟 5分钟过后自动跳转登录界面
          this.$cookie.set("manager", manager, { expires: expiresTime });
          this.$message({
            message: "登录成功！正在跳转...",
            type: "success",
            duration: 2000
          });
          setTimeout(function() {
            _that.$router.push({
              path: "/user"
            }); //路由跳转用户中心
          }, 2000);
        } else {
          _that.loading = false;
          this.$message({
            message: "登录失败,用户名或密码错误！",
            type: "error"
          });
        }
      });
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.loading = true;
          // 调用登录方法
          this.Login(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    remCheck() {
      this.checked = !this.checked;
    },
    // changeimg(){
    //   console.log(111);
    //   this.imgurl= this.imgurl + Math.floor(0,1)
    // }
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    //刷新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)//调用生成随机数的方法
        ];
      }
    },
    SleepTime(){
       this.coverImgUrl =  this.bg[this.randomNum(0, this.bg.length)]
    },
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    this.coverImgUrl =  this.bg[this.randomNum(0, this.bg.length)]


    setInterval(this.SleepTime,5000)
  
    
  },
  beforeDestroy() {
    clearInterval(setInterval(this.SleepTime,5000))
  },
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
#login {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;


  /* color: #cccccc;  */
  /*如果想做背景图片 可以给标签一个class 直接添加背景图*/
  /* position: relative; */
}
.login-bg {
  width: 100%;
  height: 100%;
  /* background: #3E3E3E; */

  /* background: url(../../assets/login9.jpg) no-repeat; */
  background-size: 100%;
}
#login_form {
  z-index: 10;
  height: 360px;
  width: 260px;
  position: absolute;
  border-radius: 20px;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 0 40px;
  background: #fff;
}
.title {
  font-weight: 600;
  font-size: 18px;
}
.title,
.el-form-item {
  margin: 15px 0;
}
.el-row {
  /* margin-bottom: 20px; */
}
.el-row:last-child {
  margin-bottom: 0;
}
</style>
