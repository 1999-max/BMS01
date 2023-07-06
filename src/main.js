import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index';
import store from './store/index'
import './api/mock'
import Cookie from 'js-cookie'

Vue.config.productionTip = false
Vue.use(ElementUI);

// 判断登录状态
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

new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    store.commit('addMenu',router)
  }
}).$mount('#app')
