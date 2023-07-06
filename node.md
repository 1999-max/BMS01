# 一、element-ui
1. 下载 npm i element-ui -S
2. 引入 在 main.js 中写入以下内容
```js
    import ElementUI from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';
    Vue.use(ElementUI);
```
3. 上面的是全局引入，还可以按需引入，减少内存
------------------------------------------
项目打包： npm run build ，生成dist文件夹
关闭eslint: vue.config.js --> lintOnSave: false
------------------------------------------

# 二、vue-router
1. 下载，npm install vue-router
(最好是npm install vue-router@3.6.5，3.x对应vue2，4.x对应vue3)
2. 使用
在src文件夹下面新建router文件夹，里面新建index.js路由表
```js
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  Vue.use(VueRouter)
```
3. 定义 (路由) 组件
src下面新建文件夹views，作为路由组件集合。
新建组件Home.vue,User.vue
在index.js路由表中引入
``````js
import Home from '../views/Home.vue';
import User from '../views/User.vue';
``````

4. 定义路由，每个路由应该映射一个组件index.js
```js
const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/user',
    component: User
  },
];
```
5. 创建 router 实例，然后传 `routes` 配置
```js
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
export default routes
// 一定记得暴露出去
```
6. 创建和挂载根实例 main.js
```js
import router from './router/index';
new Vue({
  render: h => h(App),
  routes,
}).$mount('#app')
```
7. 路由渲染App.vue
```vue
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
```

8. 嵌套路由
要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置
主路由Main.vue
```js
import Main from '../views/Main.vue'
const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: 'home',
        //  这里去掉了斜杆
        component: Home
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
];
```
特别要注意的是，在Main.vue里面要设置路由出口
```vue
<template>
  <div id="main">
    <h1>Main</h1>
    <router-view></router-view>
  </div>
</template>
```

# 三、导航栏菜单  UI 布局
1. Container布局，倒数第二个，放到Main.vue
2. 主要分为3部分：Aside，Header，Main
3. Aside：侧边栏导航+组件化思想
一般组件都放在components文件夹中！！！Aside.vue
在Aside组件中复制粘贴最后一个导航栏菜单！！
在Main.vue中引入并使用！！
```js
import Aside from '../components/Aside.vue'
export default {
  components: {
    Aside
  }
}
使用：<Aside>
```
4. 一级菜单
把导航1放在导航2下面，删除导航3/4
导航1下面的二级菜单只保留一个（其他的可以直接遍历）
```js
<el-menu>
  <el-menu-item index="2">
    <i class="el-icon-menu"></i>
    <span slot="title">导航二</span>
  </el-menu-item>

  <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">导航一</span>
    </template>
    <el-menu-item-group>
      <el-menu-item index="1-1">选项3</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</el-menu>
```
数据在“课程大纲.md”,放在Aside的data
从数据中我们可以看到，分为有子菜单和无子菜单（数据写死了）,判别方法是有无children
`````js
computed: {
  noChildren(){
    return this.menuData.filter(item => !item.children)
  },
  hasChildren(){
    return this.menuData.filter(item => item.children)
  }
}
`````
使用图标发现，element-ui的图标都是在前面加上“el-icon-”,直接动态属性字符串拼接
<i :class="`el-icon-${item.icon}`"></i>

在Vue的模板中，我们可以像访问任何普通的数据属性一样访问computed属性，使用computed属性作为v-for循环的数据源也是可以的。
实际上，使用computed属性作为v-for的数据源是非常常见的.
```js
<el-menu-item v-for="item in noChildren" :key="item.name" :index="item.name">
  <i :class="`el-icon-${item.icon}`"></i>
  <span slot="title">{{ item.label }}</span>
</el-menu-item>
```

5. 二级菜单
大差不差
```js
<el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
  <template slot="title">
    <i :class="`el-icon-${item.icon}`"></i>
    <span slot="title">{{ item.label }}</span>
  </template>
   {/* 上面是一级，下面是二级 */}
  <el-menu-item-group v-for="subItem in item.children" :key="subItem.name">
    <el-menu-item :index="subItem.name">{{ subItem.label }}</el-menu-item>
  </el-menu-item-group>
</el-submenu>
```
6. 菜单样式和less引入
调整背景色+字体颜色--略
调高度：写CSS建议使用less，因为可以避免写层级！！
安装：npm install less@4.1.2 less-loader@6.0.0
<!-- scoped表示只在当前组件起作用 -->
```css
<style lang="less" scoped>
..el-menu {
  height: 100vh;
  h3 {
    color: #fff; 
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight:400;
  }
}
</style>
```
7. body等默认样式清除App.vue
```css
<style lang="less">
body,html,h3 {
  margin: 0;
  padding: 0;
}
</style>
```

8. 侧边栏点击路由跳转
三个组件：首页Home/用户管理User/商品管理Mall(还有主组件Main),两个二级组件：PageOne，PageTwo
index.js路由表：
````js
const routes = [
  {
    path: '/', //主路由
    component: Main,
    redirect: '/home', //重定向，让路由是/时直接到首页
    children: [
      { path: 'home', component: Home },
      { path: 'user', component: User },
      { path: 'mall', component: Mall },
      { path: 'page1', component: PageOne },
      { path: 'page2', component: PageTwo },
    ]
  },
];
````
Aside.vue
```js
<el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
//  由于item是在v-for指令中定义的循环变量，它可以访问组件实例中的data属性中的数据。
// 因此，在clickMenu方法中可以访问item对象，并且可以使用它来获取data中的数据。 
clickMenu(item){
  this.$router.push(item.path);//router被挂载到vue上面
}
```

9. 解决重复点击侧边栏报错问题
<!-- this.$route是当前路由，this.$router是路由全局事例 -->
```js
clickMenu(item) {
//  只有当当前页面的路径与点击菜单项的路径不一致时，才会执行路由跳转操作。
// !(this.$route.path === '/home' && (item.path === '/')) 这个条件判断实际上是为了避免在以下情况下重复跳转：
// 当前页面路径为 /home（首页），而点击的菜单项路径也为 /（即点击首页菜单项时避免重复跳转）
  if(this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))){
    this.$router.push(item.path);//router被挂载到vue上面
  }
}
```

# 四、header组件
1. 准备工作同上，可以很明显看到分为2部分：面包屑+登录头像
Main,vue
```js
<el-header>
  <Header></Header>
</el-header>
.el-header {
  padding: 0;
}
```
2. 左边，element-ui按钮里面有图标,按钮旁边是面包屑
Header.vue
```js
<div class="l-content">
  <el-button icon="el-icon-menu" size="mini"></el-button>
  {/* 面包屑 */}
  <span class="text">首页</span>
</div>

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
}
</style>
```
3. 右边，Dropdown 下拉菜单
图片放在assets中！！！
```js
<div class="r-content">
  <el-dropdown>
    <span class="el-dropdown-link">
      <img class="user" src="../assets/images/xlz.jpg" alt="图片资源未获取">
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>个人中心</el-dropdown-item>
      <el-dropdown-item>退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</div>

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
```

4. 通过点击header左侧按钮让侧边栏进行折叠vuex(2个组件的变化)
<!-- 侧边栏的折叠是由isCollapse控制！！ -->

- State: 定义数据
- Mutations: 同步修改state, store.commit('increment')
- Getter: 计算属性
- Actions: 异步修改state, context.commit('increment')
- Modules: 数据复杂时，存储多个state(包括下面的getter/mutations/actions)

- 使用数据：(1) 在组件中 this.$store.state.name (2) 在模板中 {{$store.state.name}}
- 修改数据：分为2部分——注册+提交
第一部分注册：
```js
new Vue.store({
  mutations：{
    // 定义一个mutation来把state中保存的数据改成指定的值
    mutation名：function(state , 在执行函数时要传入的数据可选) { },
	}
})
```
第二部分提交：
```js
this.$store.commit('mutation名', 在执行函数时要传入的数据可选)
```

- 增加数据：从已有功能数据项中派生出新的数据项Getters
```js
new Vuex.store({
  getters: {
    getter的名字: function(state) {
      return 要返回的值
    }
  }
})

使用： $store.getters.getter名
```
- actions (异步请求)：
action中可以通过调用 mutation来修改state，而不是直接变更状态；
action 可以包含任意异步(例如ajax请求)操作；
```js
new Vuex.store({ 
  actions: {
    // context对象会自动传入，它与store示例具有相同的方法和对象
    action的名字: function(context, 载荷) {
      // 1. 发异步请求, 请求数据
      // 2. commit调用mutation来修改/保存数据
      // context.commit('mutation名', 载荷)
    }
  }
})
调用: this.$store.dispatch('actions的名字', 参数)
```


- 下载：npm install vuex@3.6.2 
在src下面新建文件夹store,下建index.js
在main.js中进行挂载：
```js
import store from './store/index'
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
```

现在是2个组件之间，只需要新建tab.js&& (state...都在里面)，并导出!!!
tab.js:
```js
export default {
  state: {
    isCollapse: false
  },
  mutations: {
    // 修改菜单折叠方法，会传入一个变量stated
    collapseMenu(stated){
      state.isCollapse = !stated.isCollapse;
    }
  }
}
```
index.js:
```js
import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
Vue.use(Vuex);
// 创建 vuex实例
export default new Vuex.Store({
  modules: {
    tab
  }
})
```
在Header设置点击函数
```js
<el-button @click="handleMenu()" icon="el-icon-menu" size="mini"></el-button>
handleMenu(){
  this.$store.commit('collapseMenu');
  // tab.js里面mutations的方法
}
```
在Aside里面使用：(去掉原有的isCollapse数据，在computed中使用函数)
```js
isCollapse() {
  return this.$store.state.tab.isCollapse;
}
```
5. 解决折叠遗留问题
- <h3>{{ isCollapse ? '后台' : 'BMS后台管理系统' }}</h3>
- 去掉200px（自带的）Main.vue：
  <el-aside width="auto">  <Aside></Aside> </el-aside>
- Aside:
  .el-menu { border-right: none; }

# 五、home组件布局
1. 自适应+24分栏 =  layout布局
左侧用Card
Home.vue:
```js
<el-row>
    <el-col :span="8">
      <el-card>个人信息</el-card>
      <el-card>表格</el-card>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
  </el-row>
```
左边：
```js
<el-card class="box-card">
  <div class="user">
    {/* <!-- 这里有左右，flex布局 --> */}
    <img src="../assets/images/xlz.jpg" alt="无法获取图片资源">
    <div class="userinfo">
      <p class="name">Admin</p>
      <p class="access">小琳子</P>
    </div>
  </div>
  <div class="login-info">
    <p>上次登录时间：<span>2022-10-19</span></p>
    <p>上次登录地点：<span>福建福州</span></p>
  </div>
</el-card>

<style lang="less" scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;

  img {
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .userinfo {
    .name {
      font-size: 33px;
      margin-bottom: 10px;
      line-height: 20px;
    }

    .access {
      line-height: 20px;
      color: #999999;
      font-size: 14px;
    }
  }
}
.login-info {
  p {
    margin: 0;
    padding: 0; 
    line-height: 28px;
    font-size: 14px;
    color: #999999;

    span {
      color: #666666;
      margin-left: 15px;
    }
  }
}
</style>
```
2. home购买统计部分--表格
也是放在一个card里面！！！
数据：prop对应data里面的属性的数据
```js
<el-card class="tableData">
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-for="(val,key) in tableLabel" :prop="key" :label="val"></el-table-column>
  </el-table>
</el-card>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: 'oppo',
          todayBuy: 100,
          monthBuy: 300,
          totalBuy: 800
        },
      ],
      tableLabel: {
        name: '商品',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总购买'
      }
    }
  }
}
</script>
.tableData {
  line-height: 10px;
  margin-top: 20px;
  height: 410px;
}
```
3. 右侧部分(上)
card有默认样式body-style:{padding:20px}
```js
<div class="num">
  <el-card v-for="item in countData" :key="item.name" class="num-card" :body-style="{ display:'flex',padding: 0 }">
    <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
    <div class="detail">
      <P class="price">￥{{ item.value }}</P>
      <p class="dec">{{ item.name }}</p>
    </div>
  </el-card>
</div>
.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .num-card { 
    width: 32%;
    line-height: 20px;
    margin-bottom: 10px;
    .icon {  
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      .price {
        font-size: 30px;
        margin-bottom: 10px;
        height: 30px;
        line-height: 30px;
      }
      .dec {
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
  }
}
```

4. axios
下载：
使用axios.create新建一个axios实例
```js
import axios from 'axios'
const instance = axios.create({
  baseUrl: 'http....',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
});
```
还可以定义拦截器，在请求或响应被then或catch处理前拦截：

5. 对axios进行封装！！
- src下面新建utils文件夹（工具），下建request.js
```js
import axios from 'axios'
const http = axios.create({
  baseURL: '/api', // 通用请求的地址前缀
  timeout: 1000, //超时时间
});
// 添加请求拦截器
http.interceptors.request.use(function (config) { 
  return config;
}, function (error) { 
  return Promise.reject(error);
});
// 添加响应拦截器
http.interceptors.response.use(function (response) { 
  return response;
}, function (error) { 
  return Promise.reject(error);
});
export default http
```
- src下面新建api文件夹,用于存放后端接口(或者定义接口)，下建index.js
```js
import http from '../utis/request'
// 定义接口，请求首页数据，/home/getData是后端过来的url,现在是 mock模拟
export const getData = () => {
  return http.get('/home/getData');  //返回一个promise对象
}
```
- 使用，在Home，先引入
```js
import { getData } from '../api'
mounted(){
  getData().then((data) => {
    console.log(data);
  })
}
// 请求到的地址为 http://localhost:8081/api/home/getData
```

6. mockjs模拟数据/阻止请求
Mock.mock('url'可选,'get/post'可选,template/function)
下载：npm i mockjs
在api文件夹下面新建mock.js,并且在main.js中引入
```js
import Mock from 'mockjs'
import homeApi from './mockServeData/home'

Mock.mock('/api/home/getData', 'get', homeApi.getStatisticalData);
// // 定义 mock请求拦截
// Mock.mock('/api/home/getData', 'get', function(){
//   // 拦截到请求后的处理逻辑
//   return []; //return的内容是data
// })
```
新建mockServeData文件夹 -- 对应function部分
下面建home.js(首页)，permission.js(用户数据) -- 直接复制粘贴

7. get请求带参数 && 拦截
```js
// index.js
export const getUser = (params) => {
  // 返回用户列表,getUser({name: ‘John’, age: 25})，则发送的请求URL将类似于/user/getUser?name=John&age=25
  return http.get('/user/getUser',params); // params必须是一个对象
}
// mockjs拦截 -- 正则
Mock.mock(/api\/user\/getUser/, 'get', user.getUserList);
// User使用
getUser({params: this.pageData}).then(({ data }) => {
  this.tableData = data.list;  
  this.total = data.list ? data.count : 0;  
})
```

8. 首页可视化图表样式
- 首先把左下的表格数据换了！先去掉写死的数据
Home.vue:
```js
mounted(){
  getData().then(({ data }) => {
    const { tableData } = data.data;
    // const tableData = data.data.tableData;
    this.tableData = tableData;
  })
},
```
9. chart布局
```js
<el-card style="height:280px" class="lineChart">
  {/* <!-- 折线图 --> */}
</el-card>
<div class="graph">
  {/* <!-- flex布局分左右 --> */}
  <el-card style="height:260px;width: 49%"></el-card>
  <el-card style="height:260px;width: 48%"></el-card>
</div>
.lineChart {
  margin-left: 10px;
}
.graph {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-left: 10px;
}
```

10. echarts使用
下载：npm install echarts@5.1.2
Home：import * as echarts from 'echarts'

var myChart = echarts.init(document.getElementById('main')); // 基于准备好的dom，初始化echarts实例
<!-- 下面是option数据  -->
series:当前数据；  tooltip: 提示框（鼠标移动到上面时显示）；  legend: 图例
myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。

11. Object.keys
```js
// 传入对象，返回键
const obj = {a:1,b:2,c:3} console.log(Object.keys(obj));//["a","b","c"]
// 传入字符串，返回索引
const str = "abc"; console.log(Object.keys(str)); //[0,1,2]
// 传入数组，返回索引
const arr = ["a","b","c"]; console.log(Object.keys(arr)); //["0","1","2"]
```

12. 折线图 orderData
在mounted中创建实例 
```js
<el-card style="height:280px" class="lineChart">
  // <!-- 折线图,必须给宽高 -->
  <div ref="echarts1" style="height: 280px;"></div>
</el-card>
// 初始化echarts实例
const echarts1 = echarts.init(this.$refs.echarts1);
// 指定图表的配置项和数据
var echarts1Options = {};
// 处理xAxis数据,orderData是多个对象组成的数组,orderData.data[0]是对象，返回键值
const { orderData } = data.data;   
const xAxis = Object.keys(orderData.data[0]); 
const xAxisData = {
  data: xAxis
};
echarts1Options.xAxis = xAxisData;
echarts1Options.yAxis = {}; //必须写，不然报错
// 图例
echarts1Options.legend = xAxisData;
// 当前值
echarts1Options.series = [];
xAxis.forEach(key => {
  echarts1Options.series.push({
    name: key, //苹果...
    data: orderData.data.map(item => item[key]),
    type: 'line', // 折线图
  })
})//forEach
// 根据配置显示图表
echarts1.setOption(echarts1Options);
```
13. 柱状图 userData
```js
<el-card style="height:260px;width: 49%">
  <div ref="echarts2" style="height: 260px;"></div>
</el-card>
// 直接复制粘贴
const { orderData, userData } = data.data;
const echarts2 = echarts.init(this.$refs.echarts2);
var echarts2Options = {
  legend: {
    // 图例文字颜色
    textStyle: {
      color: "#333",
    },
  },
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: userData.map(item => item.data), //userData是一个对象组成的数组
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de"],
  // 2个柱，所以2个对象
  series: [
    {
      name: '新增用户',
      data: userData.map(item => item.new),
      type: 'bar'
    },
    {
      name: '活跃用户',
      data: userData.map(item => item.active),
      type: 'bar'
    }
  ],
}//ecarts2Options
echarts2.setOption(echarts2Options);
        
```
14. 饼状图 videoData
```js
<el-card style="height:260px;width: 48%">
  <div ref="echarts3" style="height: 260px;"></div>
</el-card>
const { orderData, userData, videoData } = data.data;
const echarts3 = echarts.init(this.$refs.echarts3);
var echarts3Options = {
  tooltip: {
    trigger: "item",
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [
    {
      data: videoData,
      type: 'pie'
    }
  ],
}
echarts3.setOption(echarts3Options);
```

# 六、面包屑 && tag
1. 首先从elememt-ui拿到面包屑 Header
2. Vuex-辅助函数mapState来使用公共数据
```js
// 导入辅助函数mapState，它是在vuex中定义的一个工具函数
import { mapState } from 'vuex'
computed: {
   // ...对象，  把对象展开，合并到computed   ['数据项1'， '数据项2']
   ...mapState(['books'])
}
```

3. store/tabs.js:
在代码中，当用户点击侧边栏菜单时，会触发clickMenu方法。在这个方法中，首先会判断当前点击的菜单项是否和当前路由路径一致，
以及是否是点击了首页的菜单项。如果不满足这两个条件，即表示点击的是一个新的菜单项。
接下来会调用this.$store.commit('selectMenu', item)方法，传入点击的菜单项作为参数。
这会触发selectMenumutation，将点击的菜单项添加到tabsList数组中。
在selectMenumutation中，首先判断要添加的菜单项是否是首页，如果不是首页，则查找tabsList数组中是否已经存在相同的菜单项。
如果不存在，则使用Array.prototype.push()方法将菜单项添加到数组末尾。
这样，随着用户不断点击侧边栏菜单，相应的菜单项就会动态地添加到tabsList数组中，用于渲染面包屑。
```js
state: {
  // <!-- 首页在面包屑中是一个固定的选项，不需要根据用户的点击操作来动态添加。 -->
  tabsList: [
    {
      path: '/',
      name: 'home',
      label: '首页',
      icon: 's-home',
      url: 'Home/Home'
    }
  ], // 面包屑
},
mutations: {
  // 面包屑更新数据
  selectMenu(state,val){ 
    // 判断添加的数据是否是首页,如果不是，就从上面的数据找所点击的侧边栏是第几个
    if(val.name !== 'home'){
      const index = state.tabsList.findIndex(item => item.name === val.name);
      // 如果没有找到，即不存在,就加到上面去
      if(index === -1){
        state.tabsList.push(val);
      }
    }//home
  }//selectMenu
}
```
4. Aside
```js
clickMenu(item) {
  // 防止侧边栏重复点击
  if(this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))){
    this.$router.push(item.path);//router被挂载到vue上面
  }
  // 点击侧边栏，面包屑更新,防止重复点击
   if (this.$route.path !== item.path) {
    this.$store.commit('selectMenu', item);
  }//store/tabs.js
},
```
5. Header 渲染
```js
<el-breadcrumb separator="/">
  <el-breadcrumb-item v-for="item in tags" :to="{ path: item.path }">{{ item.label }}</el-breadcrumb-item>
</el-breadcrumb>
import { mapState } from 'vuex'
computed: {
  ...mapState({
    tags: state => state.tab.tabsList
  }) //转为数组
},
```
6. 面包屑样式调整
```js
.l-content {
  display: flex;
  align-items: center;

  /deep/.el-breadcrumb__item {
    .el-breadcrumb__inner {
      font-weight: normal;

      &.is-link {
        color: #666
      }
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #fff
      }
    }
  }
}
```

7. tag
注意：首页tag没有删除操作，其他有！！
在header和main之间新加一个组件，在components下建Tag.vue，在Main中引入、注册、使用！！！
未高亮点击删除直接删除；高亮点击删除跳转到首页；若就是最后一个删除，跳转到左边一个；
``````js
<template>
  <div class="tags">
    <el-tag 
      v-for="(item, index) in tags" 
      :key="item.path" 
      :closable="item.name !== 'home' ? true : false"
      :effect="$route.name === item.name ? 'dark' : 'plain' "
      @click="changeMenu(item)"
      {/* 关闭按钮close */}
      @close="delMenu(item,index)" 
      class="el-tag"
      size="small"
      >
      {/* 当 item.name 不等于 'home' 时，标签将会是可关闭的  */}
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList
    }) //转为数组
  },
  methods:{
    ...mapMutations(['closeTag']),
    // 点击跳转
    changeMenu(item){
      this.$router.push({ name: item.name });
    },
    delMenu(item,index){
      this.closeTag(item); //调用方法
      const length = this.tags.length;
      // 未高亮点击删除直接删除 item.name删除项 this.$route.name已激活项
      if( item.name !== this.$route.name ){
        return
      }else{
        // 若就是最后一个删除，跳转到左边一个； length是删除前的长度 ；index是当前项
        if(index === length){ //表示删除的是最后一项
          this.$router.push({
            name: this.tags[index-1].name,
          })
        }else{
          // 高亮点击删除跳转到首页
          this.$router.push({
            name: this.tags[0].name,
          })
        }// else
      }//else - one     
    }
  }
}
</script>

<style lang="less" scoped > 
.tags{
  padding: 10px 20px;
  .el-tag{
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
``````
tab.js
```js
// 删除指定的tag数据
closeTag(state,item){
  const index = state.tabsList.findIndex(val => val.name ===item.name);
  state.tabsList.splice(index,1);
}//closeTag
```
8. mapMutations
```js
mapMutations(['addAge']) //这一句就相当于下面的代码
addAge(payLoad){
  this.$store.commit('addAge',payLoad)
}
或者
...mapMutations(['closeTag']),//closeTag是tab.js中定义的方法
myfun(x){ this.closeTag(); }
```

# 七、用户管理页面
1. el-dialog弹出框,里面el-form,form里的label都是后端提供
2. 设置 inline 属性可以让表单域变为行内的表单域 :inline="true" (注意可能因为宽度不够无法生效)
```js
<el-form ref="form" :model="form" label-width="80px" :inline="true" :rules="rules">
  <el-form-item label="姓名" prop="name">
    <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
  </el-form-item>
  <el-form-item label="年龄" prop="age">
    <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
  </el-form-item>
  <el-form-item label="性别" prop="sex">
    <el-select v-model="form.sex" placeholder="请选择性别">
      <el-option label="男" value="1"></el-option>
      <el-option label="女" value="0"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="出生日期" prop="birth">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="出生日期" v-model="form.birth" style="width: 100%;"></el-date-picker>
    </el-col>
  </el-form-item>
  <el-form-item label="地址" prop="addr">
    <el-input v-model="form.addr" placeholder="请输入地址"></el-input>
  </el-form-item>
</el-form>
```
3. 表单对齐校验，点击“确定”后数据传输
Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
:rules="rules"
validate: 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise.
```js
<el-form ref="form" :model="form" label-width="80px" :inline="true" :rules="rules">
<el-form-item label="姓名" prop="name">
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
```
4. 监听到弹窗关闭 :before-close="handleClose"
before-close 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效。
如果你在 footer 具名 slot 里添加了用于关闭 Dialog 的按钮，那么可以在按钮的点击回调函数里加入 before-close 的相关逻辑。
```js
<el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
submit() {
  this.$refs.form.validate((valid) => {
    if (valid) {
      // 后续对表单数据的处理
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
```

5. 引入el-table, tableData字段
```js
<el-table :data="tableData" style="width: 100%">
  <el-table-column prop="name" label="姓名">
  </el-table-column>
  <el-table-column prop="age" label="年龄">
  </el-table-column>
  <el-table-column prop="sex" label="性别">
    <template slot-scope="scope">
      {/* <!-- 自定义列 --> */}
      <span style="margin-left: 10px">{{ scope.row.sex !== 0 ? '女' : '男' }}</span>
    </template>
  </el-table-column>
  <el-table-column prop="birth" label="出生日期">
  </el-table-column>
  <el-table-column prop="addr" label="性别">
  </el-table-column>
  <el-table-column prop="" label="操作">
  </el-table-column>
</el-table>
```
6. 新建src\api\mockServeData\user.js，复制 --- 涉及比较多的是后端的逻辑
```js
import Mock from 'mockjs'
// 模拟数据接口，包括获取用户列表、增加用户、删除用户、批量删除用户和修改用户信息等功能
// 将URL中的参数解析为一个对象，它可以将形如?key1=value1&key2=value2的参数字符串解析为{key1: value1, key2: value2}的对象形式
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}
// 生成了200条模拟的用户数据，并将其存储在List数组中，用于后续的数据操作和模拟接口返回
let List = []
const count = 200
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      addr: Mock.mock('@county(true)'),
      'age|18-60': 1,
      birth: Mock.Random.date(),
      sex: Mock.Random.integer(0, 1)
    })
  )
}

export default {
  // 根据传入的参数进行用户数据的筛选和分页，并返回符合条件的用户列表数据。
  // 在筛选过程中，会根据name参数进行姓名和地址的模糊匹配。最后返回的结果中包含了总数据量以及分页后的数据数组。
  getUserList: config => {
    const { name, page = 1, limit = 20 } = param2Obj(config.url)
    console.log('name:' + name, 'page:' + page, '分页大小limit:' + limit)
    const mockList = List.filter(user => {
      if (name && user.name.indexOf(name) === -1 && user.addr.indexOf(name) === -1) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 20000,
      count: mockList.length,
      list: pageList
    }
  },
  // 根据传入的参数，将新的创建的用户数据添加到List数组中，并返回操作成功的结果消息，生成了一个唯一的id
  createUser: config => {
    const { name, addr, age, birth, sex } = JSON.parse(config.body)
    console.log(JSON.parse(config.body))
    List.unshift({
      id: Mock.Random.guid(),
      name: name,
      addr: addr,
      age: age,
      birth: birth,
      sex: sex
    })
    return {
      code: 20000,
      data: {
        message: '添加成功'
      }
    }
  },
//  根据传入的id参数，从List数组中删除对应的用户数据，并返回相应的操作结果消息。
// 如果id参数不存在，则返回参数不正确的错误消息；如果删除成功，则返回删除成功的消息。
  deleteUser: config => {
    const { id } = JSON.parse(config.body)
    if (!id) {
      return {
        code: -999,
        message: '参数不正确'
      }
    } else {
      List = List.filter(u => u.id !== id)
      return {
        code: 20000,
        message: '删除成功'
      }
    }
  },
  // 根据传入的ids参数，批量删除List数组中相应的用户数据，并返回批量删除成功的结果消息
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 20000,
      data: {
        message: '批量删除成功'
      }
    }
  },
  // 根据传入的id参数，更新List数组中对应的用户数据，并返回编辑成功的结果消息
  updateUser: config => {
    const { id, name, addr, age, birth, sex } = JSON.parse(config.body)
    const sex_num = parseInt(sex)
    List.some(u => {
      if (u.id === id) {
        u.name = name
        u.addr = addr
        u.age = age
        u.birth = birth
        u.sex = sex_num
        return true
      }
    })
    return {
      code: 20000,
      data: {
        message: '编辑成功'
      }
    }
  }
}
```

7. mock.js && index.js
mock.js
```js
import user from './mockServeData/user'
Mock.mock('/api/user/add', 'post', user.createUser);
Mock.mock('/api/user/edit','post', user.updateUser);
Mock.mock('/api/user/del', 'post', user.deleteUser);
Mock.mock('/api/user/getUser', 'get', user.getUserList);
```
index.js
```js
export const getUser = (params) => {
  // 返回用户列表,getUser({name: ‘John’, age: 25})，则发送的请求URL将类似于/user/getUser?name=John&age=25
  return http.get('/user/getUser',params);
}
export const addUser = (data) => {
  // data参数可以是一个对象，其中的属性和值将作为请求体中的数据发送给服务器
  return http.post('/user/add',data);
}
export const editUser = (data) => {
  return http.post('/user/edit',data);
}
export const delUser = (data) => {
  return http.post('/user/del',data);
}
```
8. 在User.vue中导入使用
```js
import { getUser } from '../api/index'
mounted(){
  // 使用 ({data}) 将返回对象的 data 属性解构出来，并将其作为参数传递给then方法的回调函数,可以直接使用 data 变量来访问响应数据
  // 如果不使用解构赋值，并直接使用then(response => {...})，则在回调函数中可以通过response.data来访问响应数据。
  getUser().then(({data}) => {
    console.log(data);
    this.tableData = data.list;
  })
}
```

9. "编辑"&“新增”&“删除”
````js
<el-table-column prop="" label="操作">
  <template slot-scope="scope">
    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
    <el-button size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
  </template>
</el-table-column>
handleEdit(row){
  this.modelType = 1;
  this.dialogVisible = true;
  // 注意这里要深拷贝
  this.form = JSON.parse(JSON.stringify(row));
},
handleDelete(row){
  // Message弹窗
  this.$confirm('此操作将永久删除, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // { id:row.id }易错
    delUser({ id:row.id }).then(() => {
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
submit() {
  this.$refs.form.validate((valid) => {
    if (valid) {
      // 后续对表单数据的处理
      if(this.modelType === 0){ 
        addUser(this.form).then(() => {
          // 重新获取列表接口，可以理解为刷新
          this.getList();
        })
      }else{ 
        editUser(this.form).then(() => {
          this.getList();
        })
      }
    }//if-valid
  })//this.$refs.form.validate
},
````
10. 日期格式
```js
<el-form-item label="出生日期" prop="birth">
  <el-col :span="11">
    <el-date-picker type="date" placeholder="出生日期" v-model="form.birth" style="width: 100%;" value-format="yyyy-MM-DD"></el-date-picker>
  </el-col>
</el-form-item>
```

11. 分页
Pagination 分页
设置layout，表示需要显示的内容，用逗号分隔，布局元素会依次显示。
prev表示上一页，next为下一页，pager表示页码列表，jumper表示跳页元素，total表示总条目数，sizes用于设置每页显示的页码数量
```js
<div class="pagination">
  <el-pagination layout="prev, pager, next" :total="total" @current-change="handlePage"></el-pagination>
</div>
pageData: {
  page: 1, // 当前页码
  limit: 10, //当前页所显示条数
}
getList() {
  getUser({params: this.pageData}).then(({ data }) => {
    this.tableData = data.list;  
    this.total = data.list ? data.count : 0;  
  })
},
// 选择分页时的回调函数
handlePage(val) {
  this.pageData.page = val;
  this.getList();
}
<style lang="less" scoped>
.manage {
  height: 90%;
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
```

12. 右上角--搜索
```js
<el-form :model="userForm" :inline="true" class="manage-form">
  <el-form-item>
    <el-input placeholder="请输入名称" v-model="userForm.name"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">搜索</el-button>
  </el-form-item>
</el-form>
 getUser({ params: {...this.pageData, ...this.userForm} }).then(({ data }) => { //合并对象属性
  this.tableData = data.list;
  this.total = data.list ? data.count : 0;
})
onSubmit() {
  this.getList();
}
```

# 八、登录页面
1. 其他页面都定义在路由表，登录页面也是。
views下新建Login.vue, 路由表引入、注册
2. 页面内容主要就是el-form表单+验证
```js
<el-form ref="form" :model="form" :rules="rules" status-icon :inline="true" class="login" label-width="70px">
  <h3 class="login-title">登录页面</h3>
  <el-form-item class="username" label="账号" prop="username">
    <el-input v-model="form.username" placeholder="请输入账号"></el-input>
  </el-form-item>
  <el-form-item class="password" label="密码" prop="password">
    <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button class="login-btn" type="primary">登录</el-button>
  </el-form-item>
</el-form>
```

3. token
输入账号、密码，点击登录，这时候会调用一个登录的接口，后端会返回一个字符串，即为token.
将其作为请求的请求头！！后端从请求中获取token，从而进行验证。
4. cookie
在开发的业务中，业务需要在前端进行数据的缓存，到期就删除再进行获取新数据。
前端设置数据定时失效的可以有下面2种方法：
- 当数据较大时，可以利用localstorage，存数据时候写入一个时间，获取的时候再与当前时间进行比较
- 如果数据不超过cookie的限制大小，可以利用cookie比较方便，直接设置有效期即可。

下载：npm i js-cookie@3.0.1
引入js-cookie: import Cookies from "js-cookie";
cookie在全局使用（方法二）在main.js中引入: import Cookies from 'js-cookie'
使用：
```js
Cookies.set('name', 'value')// 写入cookie
Cookies.get('name') // => 'value'// 读取
Cookies.get('nothing') // => undefined
Cookies.get() // 读取所有可见的cookie
Cookies.remove('name') // 删除某项cookie值
```
设置有效期：
```js
//1、存cookie  set方法支持的属性有 ：expires->过期时间 ;path->设置为指定页面创建cookie; 
// domain->设置对指定域名及指定域名的子域名可见  secure->值有false和true ,表示设置是否只支持https,默认是false
Cookies.set('key', 'value');  //创建简单的cookie
Cookies.set('key', 'value', { expires: 27 });//创建有效期为27天的cookie
Cookies.set('key', 'value', { expires: 17, path: ''  }); //可以通过配置path,为当前页创建有效期7天的cookie

//2、取cookie
Cookies.get('key'); // 获取指定key 对应的value
Cookies.get(); //获取所有value

//3、删除cookie
Cookies.remove('key');//删除普通的cookie
Cookies.remove('name', { path: '' }); // 删除存了指定页面path的cookie

注意：如果存的是对象，如： userInfo = {age:111,score:90};  Cookie.set('userInfo',userInfo)
取出来的userInfo需要进行JSON的解析,解析为对象：let res = JSON.parse( Cookie.get('userInfo') );
当然你也可以使用：Cookie.getJSON('userInfo');
Cookies.get('name'); // => '{"foo":"bar"}'
Cookies.get(); // => { name: '{"foo":"bar"}' } 
Cookies.getJSON('name'); // => { foo: 'bar' }
Cookies.getJSON(); // => { name: { foo: 'bar' } }
```

- cookie在本项目应用  如果有token表示已登录
检查-->应用-->cookie

5. 导航守卫
导航守卫就是路由跳转过程中的一些钩子函数，在每一个过程中都有一函数，这个函数能让你操作一些其他的事儿的时机，
比如跳转前是否验证登录等。
- beforeRouteEnter： 路由进入之前调用，参数包括to，from，next。
  该钩子在全局守卫beforeEach和独享守卫beforeEnter之后，全局beforeResolve和全局afterEach之前调用，
  要注意的是该守卫内访问不到组件的实例，也就是this为undefined。
- beforeRouteUpdate (v 2.2+)：在当前路由改变时，并且该组件被复用时调用
- beforeRouteLeave： 导航离开该组件的对应路由时调用，可以访问组件实例this
 （to:即将要进入的路由对象； from:当前导航离开的路由； next:function,钩子）
 <!-- 
全局路由钩子：
beforeEach(to,from, next)、beforeResolve(to,from, next)、afterEach(to,from)；
独享路由钩子：
beforeEnter(to,from, next)；
组件内路由钩子：
beforeRouteEnter(to,from, next)、beforeRouteUpdate(to,from, next)、beforeRouteLeave(to,from, next)
 -->

要判断登录状态，就得在main.js搞个路由前置守卫
```js
import Cookie from 'js-cookie'
router.beforeEach((to,from,next) => {
  const token = Cookie.get('token');
  // 如果token不存在，则用户未登录，跳转到登录页面(而且这时候还不能是登录页，因为登录页也没有token)
  if(!token && to.name !== 'login'){
    // 如果token存在（即用户已登录），并且用户尝试访问的页面是登录页面（to.name === ‘login’），
    // 则会将用户重定向到主页（name: ‘home’）。这是为了避免已登录用户重复登录，或者在已登录状态下访问敏感页面。
    next({ name: 'login' })
  }else if (token && to.name === 'login'){
    next({ name: 'home' })
  }else{
    next()
  }
})
```
登录
```js
import Mock from 'mockjs'
import Cookie from 'js-cookie'
<el-button class="login-btn" type="primary" @click="submit">登录</el-button>
// 点击“登录”，通过mock模拟tooken(生成随机字符串)
submit(){
  const token = Mock.Random.guid();
  // token信息存入cookie用于不同页面间的通信
  Cookie.set('token',token);
  this.$router.push('/home')
}
```

6. 把token重新整理 -- mock
src\api\mockServeData\permission.js 复制粘贴
这段代码是一个模拟接口请求，根据传入的用户名和密码判断用户是否存在以及账号密码是否对应。
首先，从config中解析出传入的用户名和密码：
```javascript
const { username, password } = JSON.parse(config.body)
```
然后，通过判断用户名和密码的值来决定返回的数据。以下是代码的逻辑：
- 如果用户名和密码都是"admin"，则返回一个包含完整菜单信息、token和成功信息的对象。
- 如果用户名和密码都是"xiaoxiao"，则返回一个只包含部分菜单信息、token和成功信息的对象。
- 如果用户名和密码都不匹配上述两种情况，则返回一个包含错误信息的对象。

返回的对象具体结构如下：
```javascript
{
  code: 20000, // 成功返回的状态码
  data: {
    menu: [ // 菜单信息
      // 菜单项
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 's-home',
        url: 'Home.vue'
      },
      // 其他菜单项...
    ],
    token: '生成的随机token',
    message: '获取成功' // 成功信息
  }
}
```

mock.js中定义
```js
import permission from './mockServeData/permission'
Mock.mock(/api\/permission\/getMenu/, 'post',permission.getMenu);
```
index.js
```js
export const getMenu = (data) => {
  return http.post('/permission/getMenu',data);
}
```
修正Login
```js
import { getMenu } from '../api/index'
// 表单先校验后再对账号密码验证
submit() {   
  this.$refs.form.validate((valid) => {
    if (valid) {
      getMenu(this.form).then(({ data }) => { 
        if (data.code === 20000) {  // code后端给的
          Cookie.set('token', data.data.token)  
          this.$router.push('/home')
        } else {
          this.$message.error(data.data.message); //密码错误
        }
      }) //getMenu
    }// if-valid
  })//ref
},//submit
```

7. 登出
el-dropdown-menu不能直接@click!!!!
```js
<el-dropdown @command="handleClick">
<el-dropdown-item command="cancel">退出</el-dropdown-item>
handleClick(command){
  if(command === 'cancel'){
    Cookie.remove('token');
    this.$router.push('/login')
  }
}
```

# 九、权限控制
1. 不能通过url进行跳转 --- 动态路由
因为如果不是用管理员的账号进入，是看不到用户管理的，这是在url上面改为“user”，是不能进入用户管理页面
2. src\components\Aside.vue中menuData数据改为动态
- store/tab.js
```js
state: {
  isCollapse: false, // 控制侧边栏折叠
  tabsList: [...], // 面包屑
  menu: []
},
// 设置menu(路由)的数据
mutations: {
  setMenu(state, val) {
    state.menu = val;
  },
}
```
- Login.vue
```js
getMenu(this.form).then(({ data }) => { 
  if (data.code === 20000) {  // code后端给的
    Cookie.set('token', data.data.token) 
    // 获取菜单的数据，存入store中
    this.$store.commit('setMenu', data.data.menu) 
    this.$router.push('/home')
  } else {
    this.$message.error(data.data.message); //密码错误
  }
}) 
```

- Aside.vue
将menuData数据替换, 在computed里面
```js
menuData(){
  return this.$store.state.tab.menu;
}
```
但现在存在问题：刷新后，由于 tab.js中的menu为空，会导致Aside不存在
解决： cookie实现缓存
tab.js
```js
import Cookie from 'js-cookie'
setMenu(state, val) {
  state.menu = val;
  Cookie.set('menu',JSON.stringify(val)); // cookie的值必须是字符串
},
```
Aside
```js
import Cookie from 'js-cookie'
menuData(){
  return Cookie.get('menu') ? JSON.parse(Cookie.get('menu')) : this.$store.state.tab.menu;
}
```

3. 动态路由注册
tab.js注册
```js
// 动态注册路由
addMenu(state,router){
  const menuArray = [];
  // 判断缓存中是否有数据
  if(!Cookie.get('menu')) return
  const menu = JSON.parse(Cookie.get('menu'))
  state.menu = menu; // 刷新
  // 动态处理路由
  menu.forEach(item => {
    if(item.children) { //有子路由
      item.children = item.children.map(item => {
        item.component = () => import(`../views/${item.url}`)
        return item
      })
      menuArray.push(...item.children) //添加
    }else{ // 没有子路由
      item.component = () => import(`../views/${item.url}`)
      menuArray.push(item)
    }
  });//forEach 
  // 路由动态添加
  menuArray.forEach(item => {
    router.addRoute('main',item); // 添加到路由表name='main'的主路由里面
  })
}, //addMenu
```
Login使用
```js
this.$store.commit('addMenu', this.$router) 
```
登出Header
```js
handleClick(command){
  if(command === 'cancel'){
    Cookie.remove('token');
    Cookie.remove('menu');
    this.$router.push('/login')
  }
}
```
PS： 路由表children下面记得注释掉！！

4. 我们动态路由使用是在点击“登录”，但是如果我们在首页刷新，就没有登录按钮，拿不到路由！！造成白屏！！
刷新是new Vue()初始化！
```js
new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    store.commit('addMenu',router)
  }
}).$mount('#app')
```


# 问题 
1. 侧边栏点击二级菜单没反应 
2. 重复点击面包屑/tag会报错
3. 面包屑样式有问题
4. 删除导航栏时，左边的高亮没有一起改变






