<template>
  <div id="rules">
    <el-row style="margin-bottom: 10px;">
      <el-button
        size="small"
        type="success"
        style="float: left; width: 65;"
        icon="el-icon-plus"
        @click="addData"
        >添加
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="400"
      :header-cell-style="{
        background: '#F3F4F7',
        color: '#555',
        textAlign: 'center'
      }"
      :cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column fixed prop="id" label="编号" width="150">
      </el-table-column>
      <el-table-column prop="name" label="角色名称" width="120">
      </el-table-column>
      <el-table-column prop="rule_name" label="角色权限"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog
      class="dialog"
      :title="title"
      :visible.sync="isshow"
      @close="closeDilog"
    >
      <el-form :model="form" ref="form" :rules="rules" show-message>
        <el-form-item
          label="角色名称："
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入角色名称"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="拥有权限：" :label-width="formLabelWidth">
          <div v-for="item in meauList" :key="item.id">
            <span style="font-weight:bolder"> {{ item.title }}：</span>
            <el-checkbox
              v-model="item.checked"
              @change="handleCheckAllChange(item, item.submenu)"
              >全选</el-checkbox
            >
            <div style="margin: 5px 0;border-bottom: 1px dotted #000000; ">
              <el-checkbox-group
                v-if="item.submenu != ''"
                v-model="checkedList"
                @change="handleCheckedCitiesChange(item, item.submenu)"
              >
                <el-checkbox
                  v-for="item2 in item.submenu"
                  :label="item2.id"
                  :key="item2.id"
                  >{{ item2.title }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="yesButton('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { rulesList, rulesSave,rulesDel } from "../../common/api/roles.js";
import { getMeauList } from "../../common/api/meau.js";

// const cityOptions = ;
export default {
  data() {
    var validateTitle = (rule, value, callback) => {
      // console.log(value);
      if (value === "") {
        callback(new Error("请输入角色名称"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      isshow: false, //弹窗是否显示
      title: "添加", //弹窗标题
      form: {
        name: "",
        rules: {}
      },
      formLabelWidth: "100px",
      rules: {
        name: [
          {
            validator: validateTitle,
            trigger: "blur"
          }
        ]
      },

      checkAll: false,
      checkedList: [],
      meauList: []
      // cities: ,
    };
  },
  methods: {
    // 获取角色数据
    getRolesList() {
      rulesList().then(res => {
        console.log(res);
        if (res.code == 200) {
          this.tableData = res.data.data;
        }
      });
      // console.log(this.tableData);
    },
    // 添加角色
    addData() {
      //   console.log("add");
      this.isshow = true;
    },
    // 删除
    handleDelete(index, row) {
      console.log("add");
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(row.id);
          var type = "";
          // 调用删除接口
          rulesDel({ id: row.id }).then(res => {
            if (res.code == 200) {
              // 刷新数据
              this.getRolesList();
              type = "success";
            } else {
              type = "error";
            }
            this.$message({
              type: type,
              message: res.msg
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

    },
    // 编辑
    handleEdit(index, row) {
      console.log("编辑");
      console.log(row);
      // 将表格中的内容显示到弹窗上
      // 避免表格数据和弹窗上的数据直接同步
      // 重新赋值 并转化一下数据类型
      let data = JSON.stringify(row);
      // 赋值弹窗
      this.form = JSON.parse(data);
      delete  this.form.rule_name;//剔除对象中这个属性  因为传值不需要
      // console.log(this.form)

      // console.log(typeof this.form.rules);//String类型

      this.checkedList = this.form.rules.split(","); //转成数组

      // console.log(this.meauList);
      this.meauList.forEach(item => {

        // console.log(this.checkedList.indexOf(item.id) != -1); 
        if (this.checkedList.indexOf(item.id) != -1) {
          //选择数据列表中存在该下标数据  勾选对应的全选
          item.checked = true; //赋值为true
        }
      });
      console.log(this.meauList);
      // 显示弹窗
      this.isshow = true;
      // 修改弹窗标题
      this.title = "编辑";
    },

    // 提交数据按钮
    yesButton(form) {
    
      // 判断验证是否通过
      this.$refs[form].validate(valid => {
        if (valid) {
          // 将数组转换成对象类型
           this.form.rules = {};
          for (let index = 0; index < this.checkedList.length; index++) {
            this.form.rules[index] = this.checkedList[index];
          }
          console.log(this.form);
          // return ;
          // this.form数据中有id表示编辑 没有就是添加
          rulesSave(this.form).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              // 更新菜单表格数据
              this.getRolesList();
              // 将弹窗关掉
              this.isshow = false;
              // 将表单数据清空
              this.form = {};
              this.checkedList = [];
              this.getrules();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 取消按钮
    cancel() {
      (this.isshow = false), (this.checkedList = []);
      this.getrules();
      this.form.name = ""
    },
    // X 关闭弹窗
    closeDilog() {
      (this.isshow = false), (this.checkedList = []);
      this.getrules();
      this.form.name = ""
    },

    // 获取角色权限的数据
    getrules() {
      //  var that = this;
      getMeauList().then(res => {
        // console.log(res.data);
        if (res.code == 200) {
          res.data.forEach((item, index) => {
            if (item.title == "") {
              res.data.splice(index, 1);
            } else {
              item["checked"] = false;
            }
          });
          //  console.log(res.data);

          this.meauList = res.data;
          // console.log(this.meauList);
        }
      });
      //  console.log(this.meauList);
    },

    // 隔行换色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
      return "";
    },

    handleCheckAllChange(item, submenu) {
      console.log(item, submenu);
      // 1.判断全选按钮是否是选中
      // 2.选中后 判断之前的选中列表是否有相同的数据
      // 3.将对应的子菜单下面的id 添加到选中的列表中
      if (item.checked) {
        if (submenu != "") {
             // 上级菜单
            if (this.checkedList.indexOf(item.id) == -1) {
              //没有找到相同的数据 添加进去
              this.checkedList.push(item.id);
            }
          submenu.forEach(item => {
            if (this.checkedList.indexOf(item.id) == -1) {
              //没有找到相同的数据 添加进去
              this.checkedList.push(item.id);
            }
          });
        } else {
          //只有一级菜单
          item.forEach(item => {
            if (this.checkedList.indexOf(item.id) == -1) {
              //没有找到相同的数据 添加进去
              this.checkedList.push(item.id);
            }
          });
        }
      } else {
        this.checkedList.splice(this.checkedList.indexOf(item.id), 1);  //找到相同的数据 剔除
        submenu.forEach(item => {
          this.checkedList.splice(this.checkedList.indexOf(item.id), 1); //找到相同的数据 剔除
        });
      }
      console.log(this.checkedList);
    },
    handleCheckedCitiesChange(item, submenu) {
      // 1.选中的值会自动添加到 选中的列表中
      // 2.如果子菜单全选中  上级菜单的全选需要选中

      // console.log(item,submenu);
      console.log(this.checkedList);
      let checkedCount = 0;
      submenu.forEach(item => {
        if (this.checkedList.indexOf(item.id) != -1) {
          //选中列表中有 子菜单的数据
          checkedCount++; //选中的数目加一
        }
      });
      item.checked = checkedCount == submenu.length; //如果选中数目 与其长度一致 将上级全选
      console.log(item.checked);
    }
  },
  created() {
    this.getRolesList();
    this.getrules();
  }
};
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #fff;
}
.el-form-item__content {
  text-align: left;
  white-space: normal;
}
.dialog .el-dialog {
  width: 40% !important ;
}
</style>
