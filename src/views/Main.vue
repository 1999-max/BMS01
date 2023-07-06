<template>
  <div id="main">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="auto">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <Header></Header>
        </el-header>
         <!-- tag -->
        <Tag></Tag>
        <!-- 主要内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from '../components/Aside.vue'
import Header from '../components/Header.vue'
import Tag from '../components/Tag.vue'

export default {
  data(){
    return{
      
    }
  },
  components: {
    Aside,
    Header,
    Tag,
  }
}

</script>

<style scoped>
.el-header {
    padding: 0
}
</style>