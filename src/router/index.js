import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Mall from '../views/Mall.vue'
import PageOne from '../views/PageOne.vue'
import PageTwo from '../views/PageTwo.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    name: 'main',
    redirect: '/home',
    children: [
      // {
      //   path: 'home',  //  这里去掉了斜杆
      //   name: 'home',
      //   component: Home
      // },
      // {
      //   path: 'user',
      //   name: 'user',
      //   component: User
      // },
      // {
      //   path: 'mall',
      //   name: 'mall',
      //   component: Mall
      // },
      // {
      //   path: 'page1',
      //   name: 'page1',
      //   component: PageOne
      // },
      // {
      //   path: 'page2',
      //   name: 'page2',
      //   component: PageTwo
      // }
    ]
  },
  {
    path: '/login',
    component: Login,
    name: 'login' // mainjs中token
  }
];

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
export default router
// 一定记得暴露出去
