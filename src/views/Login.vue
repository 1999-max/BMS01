<template>
  <el-form ref="form" :model="form" :rules="rules" status-icon :inline="true" class="login" label-width="70px">
    <h3 class="login-title">登录页面</h3>
    <el-form-item class="username" label="账号" prop="username">
      <el-input v-model="form.username" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item class="password" label="密码" prop="password">
      <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="login-btn" type="primary" @click="submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Mock from 'mockjs'
import Cookie from 'js-cookie'
import { getMenu } from '../api/index'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: { 
    submit() {
      // const token = Mock.Random.guid();
      // token信息存入cookie用于不同页面间的通信
      // Cookie.set('token',token);      
      this.$refs.form.validate((valid) => {
        if (valid) {
          getMenu(this.form).then(({ data }) => { 
            if (data.code === 20000) {  // code后端给的
              Cookie.set('token', data.data.token) 
              // 获取菜单的数据，存入store中
              this.$store.commit('setMenu', data.data.menu)
              this.$store.commit('addMenu', this.$router) 
              this.$router.push('/home')
            } else {
              this.$message.error(data.data.message); //密码错误
            }
          }) //getMenu
        }// if-valid
      })//ref
    },//submit
  },
  mounted(){

  }
}

</script>

<style lang="less" scoped>
.login {
  width: 350px;
  border: 1px solid #eaeaea;
  margin: 180px auto;
  padding: 35px 20px 15px 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 25px #cac6c6;
  // box-sizing: border-box; // 350里面包含内边距

  .login-title {
    text-align: center;
    margin-bottom: 40px;
    color: #505458;
  }

  .el-input {
    width: 198px;
  }

  .login-btn {
    margin-left: 140px; // 居中
    margin-top: 10px;
  }
}
</style>