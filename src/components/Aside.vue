<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <h3>{{ isCollapse ? '后台' : '后台管理系统' }}</h3>
    <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
      <!-- 由于item是在v-for指令中定义的循环变量，它可以访问组件实例中的data属性中的数据。因此，在clickMenu方法中可以访问item对象，并且可以使用它来获取data中的数据。 -->
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
      <template slot="title">
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.name" @click="clickMenu(subItem)">
        <el-menu-item :index="subItem.name">{{ subItem.label }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  data() {
    return {
    
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item) {
      // 防止侧边栏重复点击
      if (this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))) {
        this.$store.commit('selectMenu', item); 
        this.$router.push(item.path);//router被挂载到vue上面 
        // this.$router.replace(item.path);
      }
      // 点击侧边栏，面包屑更新
      // this.$store.commit('selectMenu', item); 
    },
  },
  computed: {
    noChildren() {
      return this.menuData.filter(item => !item.children)
    },
    hasChildren() {
      return this.menuData.filter(item => item.children)
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
    menuData(){
      return Cookie.get('menu') ? JSON.parse(Cookie.get('menu')) : this.$store.state.tab.menu;
    }
  }
}
</script>

<style lang="less" scoped>
html,
body {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100vh;
  border-right: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>