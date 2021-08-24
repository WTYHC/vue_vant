<template>
  <div>
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
      style="width: 100%;margin-bottom: 20px; "
      row-key="id"
      border
      :tree-props="{ children: 'submenu' }"
      :header-cell-style="{
        background: '#F3F4F7',
        color: '#555',
        textAlign: 'center'
      }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="id" label="编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="title" label="名称" sortable width="180">
      </el-table-column>
      <el-table-column prop="url" label="链接地址"> </el-table-column>
      <el-table-column prop="compont_path" label="路径">
        <template slot-scope="scope">
          <span>{{
            scope.row.compont_path == "" ? "无" : scope.row.compont_path
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pid" label="等级"> </el-table-column>
      <el-table-column prop="status" label="是否显示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
          >
          </el-switch>
        </template>
      </el-table-column>
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
    <el-dialog :title="title" :visible.sync="isshow">
      <el-form :model="form" ref="form" :rules="rules" show-message>
        <el-form-item
          label="菜单名称"
          prop="title"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入菜单名称"
            v-model="form.title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单级别" :label-width="formLabelWidth">
          <el-select
            v-model="form.pid"
            style="display: block;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="链接地址" :label-width="formLabelWidth">
          <el-input
            placeholder="请输入路径如：/index"
            v-model="form.url"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="路径"
          prop="compont_path"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入路径如：/meau/index"
            v-model="form.compont_path"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="侧边栏是否显示"
          :label-width="formLabelWidth"
          style="text-align:left"
        >
          <el-switch
            v-model="form.status"
            :active-value="'1'"
            :inactive-value="'0'"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isshow = false">取 消</el-button>
        <el-button type="primary" @click="yesButton('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMeauList, menuSave, menuDel } from "../../common/api/meau.js";
export default {
  data() {
    var validateTitle = (rule, value, callback) => {
      // console.log(value);
      if (value === "") {
        callback(new Error("请输入菜单名称"));
      } else {
        callback();
      }
    };
    var validatePath = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入地址"));
      } else {
        callback();
      }
    };
    var validateUrl = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入链接地址"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      isshow: false,
      title: "添加",
      options: [], //下拉菜单级别选择数据
      form: {
        title: "",
        url: "",
        pid: "0",
        compont_path: "",
        sort: "",
        status: "0"
      },
      formLabelWidth: "100px",
      value: "",
      rules: {
        compont_path: [
          {
            validator: validatePath,
            trigger: "blur"
          }
        ],
        title: [
          {
            validator: validateTitle,
            trigger: "blur"
          }
        ],
        url: [
          {
            validator: validateUrl,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 获取菜单表格数据
    getData() {
      // 先清空数据这样再次请求数据时 之前数据不会干扰
      this.options = [];
      let opdata;
      opdata = { id: "0", title: "顶级菜单" };
      this.options.push(opdata);
      getMeauList().then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
          console.log(this.tableData);

          this.tableData.forEach((item, index) => {
            if (item.title != "") {
              opdata = {
                id: item.id,
                title: item.title
              };
              this.options.push(opdata);
            } else {
              this.tableData.splice(index, 1);
            }
          });
        }
      });
    },

    // 编辑
    handleEdit(index, row) {
      // console.log(index, row);
      this.title = '编辑';
      this.isshow = true;
      var data = JSON.stringify(row);
      this.form = JSON.parse(data);
      console.log(this.form);

    },

    // 表格单行删除操作
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(row.id);
          var type = "";
          // 调用删除接口
          menuDel({ id: row.id }).then(res => {
            if (res.code == 200) {
              // 刷新数据
              this.getData();
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
    
    // 添加
    addData() {
      this.form={};
      this.isshow = true;
    },
    // 对话框的确认操作
    yesButton(form) {
      console.log(this.form.status);
      console.log(this.form);
      // 1.先判断表单数据验证是否通过
      // 2.获取表单中的数据
      // 3.将表单数据提交给后台
      // 4.更新表格数据
      // 5.根据是否显示到侧边栏来更新侧边栏的数据
      this.$refs[form].validate(valid => {
        if (valid) {
          // this.form数据中有id表示编辑 没有就是添加
          menuSave(this.form).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              // 更新菜单表格数据
              this.getData();
              // 将弹窗关掉
              this.isshow = false;
              // 将表单数据清空
              this.form = {};
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    // 从本地获取菜单数据 因为登录之后菜单数据已存在本地
    // this.tableData = JSON.parse(localStorage.getItem("meauList"));
    this.getData();
  }
};
</script>
