<template>
  <div class="header-container">
    <div class="l-content">
      <el-button style="margin-right: 20px;" @click="handleMenu()" icon="el-icon-menu" size="mini"></el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb"> 
        <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link">
          <img class="user" src="../assets/images/xlz.jpg" alt="图片资源未获取">
          <!-- <img class="user" src="../assets/images/user.png" alt="图片资源未获取"> -->
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookie from 'js-cookie'

export default {
  data() {
    return {

    }
  },
  methods: {
    handleMenu() {
      this.$store.commit('collapseMenu');
      // tab.js里面mutations的方法
    },
    handleClick(command){
      if(command === 'cancel'){
        Cookie.remove('token');
        Cookie.remove('menu');
        this.$router.push('/login')
      }
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList
    }) //转为数组
  },
}

</script>

<style>
.header-container {
  background-color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .text {
    color: #fff;
    font-size: 15px;
    margin-left: 10px;
  }

  .r-content {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      align-self: center;
    }
  }

  .l-content {
    display: flex;
    align-items: center;

    /deep/.el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal; 
        &.is-link {
          color: #fff
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: #fff
        }
      }
    }
  }
}
</style>
