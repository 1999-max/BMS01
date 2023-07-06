
<template>
  <div class="manage">
    <!-- 新增按钮的弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <!-- 表单信息 -->
      <el-form ref="form" :model="form" label-width="80px" :inline="true" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="出生日期" v-model="form.birth" style="width: 100%;"
              value-format="yyyy-MM-DD"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增按钮 && 搜索 -->
    <div class="manage-header">
      <el-button type="primary" @click="handleAdd" class="manage-btn">新增</el-button>
      <!-- form搜索 -->
      <el-form :model="userForm" :inline="true" class="manage-form">
        <el-form-item>
          <el-input placeholder="请输入名称" v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-table">
      <!-- 用户表格 -->
      <el-table :data="tableData" style="width: 100%" height="90%" stripe>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="age" label="年龄">
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <!-- 自定义列 -->
            <span style="margin-left: 10px">{{ scope.row.sex !== 0 ? '女' : '男' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="birth" label="出生日期">
        </el-table-column>
        <el-table-column prop="addr" label="性别">
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="handlePage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, addUser, editUser, delUser } from '../api/index'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        age: '',
        sex: '',
        birth: '',
        addr: '',
      },
      rules: {
        // 对el-input输入框的验证，trigger的值选blur，即失去焦点时进行验证
        name: [
          { required: true, message: '请输入姓名' }
        ],
        age: [
          { required: true, message: '请输入年龄' }
        ],
        sex: [
          { required: true, message: '请选择性别' }
        ],
        birth: [
          { required: true, message: '请选择出生日期' }
        ],
        addr: [
          { required: true, message: '请输入地址' }
        ]
      },
      tableData: [],
      modelType: 0, // 判断是新增还是编辑，0新增
      total: 0, //分页总条数
      pageData: {
        page: 1, // 当前页码
        limit: 10, //当前页所显示条数
      },
      userForm: {
        name: '',// 表单搜索
      }
    }
  },
  methods: {
    // 提交用户表单
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 后续对表单数据的处理
          if (this.modelType === 0) {
            addUser(this.form).then(() => {
              // 重新获取列表接口，可以理解为刷新
              this.getList();
            })
          } else {
            editUser(this.form).then(() => {
              this.getList();
            })
          }
          // 清空表单的数据
          this.$refs.form.resetFields()
          // 关闭弹窗
          this.dialogVisible = false
        }//if-valid
      })//this.$refs.form.validate
    },
    // 监听到弹窗关闭
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // before-close 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效, 点击“取消”时则用这个方法
    cancel() {
      this.handleClose();
    },
    handleEdit(row) {
      this.modelType = 1;
      this.dialogVisible = true;
      // 注意这里要深拷贝
      this.form = JSON.parse(JSON.stringify(row));
    },
    handleDelete(row) {
      // Message弹窗
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList(); //刷新
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getList() {
      // 使用 ({data}) 将返回对象的 data 属性解构出来，并将其作为参数传递给then方法的回调函数,可以直接使用 data 变量来访问响应数据
      // 如果不使用解构赋值，并直接使用then(response => {...})，则在回调函数中可以通过response.data来访问响应数据。
      getUser({ params: { ...this.pageData, ...this.userForm } }).then(({ data }) => {
        this.tableData = data.list;
        this.total = data.list ? data.count : 0;
      })
    },
    // 新增按钮
    handleAdd() {
      this.modelType = 0;
      this.dialogVisible = true;
    },
    // 选择分页时的回调函数
    handlePage(val) {
      this.pageData.page = val;
      this.getList();
    },
    // 列表搜索
    onSubmit() {
      this.getList();
    }
  },
  mounted() {
    // 数据列表是一开始就展示 tableData
    this.getList();
  }
}

</script>

<style lang="less" scoped>
.manage {
  height: 90%; 
  .manage-header{
    display: flex;
    justify-content: space-between;
    align-items: center; 
  }
  .common-table {
    position: relative;
    height: calc(100% - 62px); // 动态计算高度 

    .pagination {
      position: absolute;
      bottom: 0;
      right: 20px;
    }
  }
}
</style>