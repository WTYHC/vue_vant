<template>
  <div id="user">
    <el-row style="margin-bottom: 10px; height: auto; ">
      <el-input size="small" style="float: left; width: 200px !important;margin-right: 10px;" v-model="search"
        placeholder="输入关键字搜索"></el-input>
<!-- 
      <el-button
        size="small"
        type="success"
        style="float: left; width: 65;"
        icon="el-icon-search"
        @click="SearchData"
        >查询
      </el-button> -->
    </el-row>

    <el-row style="margin-bottom: 10px;">
      <el-button size="small" type="success" style="float: left; width: 65;" icon="el-icon-plus" @click="addData">添加
      </el-button>
      <el-button size="small" type="danger" style="float: left; width: 65;" icon="el-icon-delete" @click="delMore">批量删除
      </el-button>
    </el-row>


    <el-table id="eltable" :data="tableData" height="400" border style="width: auto " :header-cell-style="{
          background: '#F3F4F7',
          color: '#555',
          textAlign: 'center'
        }" :cell-style="{ textAlign: 'center' }" select-on-indeterminate  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="编号" width="50"> </el-table-column>
      <el-table-column prop="name" label="用户名" width="100">
      </el-table-column>
      <el-table-column prop="real_name" label="真实姓名" width="100"> </el-table-column>

      <el-table-column prop="phone" label="手机号" width="120"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="point" label="积分"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="'1'" :inactive-value="'0'"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="selectedOptions" :formatter="shengshiData" label="省市区" width="200">
      </el-table-column>
      <el-table-column prop="birthday" label="创建时间" width="120">

      </el-table-column>
      <el-table-column prop="balance" label="余额" width="120"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination background :hide-on-single-page="false" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]"
        :page-size="limit" layout="total, sizes,prev, pager, next, jumper" :total="DataTotal">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="isshow">
      <el-form :model="form" ref="form" :rules="rules" show-message>
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-input placeholder="请输入用户名" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name" :label-width="formLabelWidth">
          <el-input placeholder="请输入真实姓名" v-model="form.real_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  v-if="title=='添加'"  label="密码" prop="password" :label-width="formLabelWidth">
          <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
          <el-input placeholder="请输入手机号" v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth">
          <el-input placeholder="请输入电子邮箱" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="balance" :label-width="formLabelWidth">
            <el-input placeholder="0.0" v-model="form.balance" autocomplete="off"></el-input>
          </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth" style="text-align:left">
          <el-switch v-model="form.status"   :active-value="'1'"
          :inactive-value="'0'"> </el-switch>
        </el-form-item>
      </el-form>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isshow =false">取 消</el-button>
        <el-button type="primary" @click="yesButton('form')">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<style>
 

  /* 分页 */
  .block {
    margin-top: 15px;
    text-align: left;
  }

  .el-dialog {
    width: 30% ;
  }




  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px !important;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  /* 表单 */
</style>

<script>
  import {
    regionData
  } from "element-china-area-data";

  // 引用请求接口
  import {
    getUserList,
    userSave,
    delUser
  } from "../../common/api/user.js";

  // 引入正则表达式
  import {
    isTel
  } from "../../common/util/util.js"

  export default {
    name: "index",
    data() {
      var validateName = (rule, value, callback) => {
        // console.log(value);
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
      var validateTel = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入手机号"));
        } else {
          if (!isTel(value)) {
            callback(new Error("输入的手机号格式不对"));
          } else {
            callback();
          }
        }
      };
      return {
        tableData: [],
        isshow: false,
        title: "添加",

        fileList: [],
        imageUrl: "",
        form: {
          name: "",
          phone: "",
          password: "",
          real_name: "",
          status: "0",
          email: "",
          balance:"",
        },
        rules: {
          password: [{
            validator: validatePass,
            trigger: "blur"
          }],
          name: [{
            validator: validateName,
            trigger: "blur"
          }],
          phone: [{
            validator: validateTel,
            trigger: "blur"
          }],
        },
        options: regionData, //地区数据
        formLabelWidth: "100px",
        DataTotal: 0,
        currentPage: 1,
        limit: 5,
        search: "",
        allData: [], //获得所有的数据
        newSearch: [],
        isSearch: false,
        delId:[],//删除id的数组
      };
    },
    methods: {
      // 获取数据的操作
      getAllData() {
        getUserList(this.currentPage).then(res => {
          console.log(res.data);
          this.tableData = res.data.data;
          this.DataTotal = parseInt(res.data.total);
        })
      },

     

      // 省市区数据格式化
      shengshiData(row) {
        console.log(row.selectedOptions);
        // let arr = [];
        // row.selectedOptions.forEach((item, index) => {
        //   if (index > 2) {
        //     return;
        //   }
        //   //  将城市的数字码转成文字
        //   item = CodeToText[item];
        //   arr.push(item);
        // });
        // return arr.join("-");
      },

      // 添加的按钮
      addData() {
        this.title = "添加";
        this.isshow = true;
      },
      
      // 编辑操作
      handleEdit(index, row) {
        // console.log(row);
        this.isshow = true;
        this.title = "编辑";

        // 进行一下数据的转化 避免表格中数据与对话框数据同步修改问题
        let data  = JSON.stringify(row);
        this.form = JSON.parse(data);
      },

      // 对话框的确认操作
      yesButton(formName) {
        console.log( this.form.status);
        this.$refs[formName].validate((valid) => {
          if (valid) {   
              //this.form数据中有id表示编辑 没有就是添加
              userSave(this.form).then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: res.msg
                  });
                  this.getAllData();
                  this.isshow = false;
                  this.form = {};
                }

              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

        // 删除操作
      handleDelete(index, row) {
        console.log(index, row);
        // var that = this;
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            // console.log(row.id);
            this.delapi(row.id);
            // 刷新数据
            this.getAllData();
     
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },

       // 批量删除
       delMore() {
        // console.log("del");
     
        this.$confirm("此操作将永久删除选择的数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            console.log(this.delId);
            this.delapi(this.delId);
            // 刷新数据
            this.getAllData();
            
            // 清空数组中的数据
            // 不在取消后清空数据 是为了取消之后 选择未取消 重新点击删除 还可以删除
            this.delId = [];
     
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            
          });  
      },

      // 多选
      handleSelectionChange(val) {
        this.delId = []; //先清空一下数据  防止上次取消时还存有数据
        val.forEach(item => {
           this.delId.push(item.id); //将选择的id放入delid的数组里面
        });
      },

      // 删除接口
      delapi(id) {
        let param = {id:id}
        delUser(param).then(res => {
          console.log(res);
          if(res.code==200){
            this.$message({
              type: "success",
              message: "删除成功！"
            });
          }
        })
      },


      // //  搜索
      // SearchData() {
      //   var _that = this;
      //   if (this.search) {
      //     this.isSearch = true;
      //     this.newSearch = [];
      //     this.allData.filter(value => {
      //       //过滤全部数据
      //       //  console.log(value);
      //       // 如果包含字符返回true,将表格数据重新赋值
      //       if (value.name.toLowerCase().includes(_that.search.toLowerCase())) {
      //         _that.newSearch.push(value);
      //         console.log(_that.newSearch);

      //         _that.DataTotal = _that.newSearch.length;
      //       }
      //     });
      //     this.showData();
      //   } else {
      //     //搜索数据为空，则显示全部数据 调用获取数据方法
      //     this.getData();
      //   }
      // },

      // // 分页功能
      // // 修改每页的大小
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.limit = val;
        if (this.isSearch) {
          this.showData();
        } else {
          // this.getData();
          this.isSearch = false;
        }
      },
      // 当前页
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage = val;
        if (this.isSearch) {
          this.showData();
        } else {
          // this.getData();
          this.isSearch = false;
        }
      },
    
    },

      // // 搜索数据分页
      // showData() {
      // console.log("se" + this.newSearch);
      // // console.log("se"+ this.limit+"-"+this.currentPage);
      // var start = this.limit * (this.currentPage - 1);
      // var end =
      //   this.limit * this.currentPage > this.DataTotal
      //     ? this.DataTotal
      //     : this.limit * this.currentPage;
      // // console.log(`当前页: ${start}:${end}`);
      // this.tableData = this.newSearch.slice(start, end);
      // //  console.log("tb"+  this.tableData);
      // }

   

    created() {

      this.getAllData();

      console.log(this.$router)
      // console.log(this.$store.state.meauList);
      

    }
  };
</script>