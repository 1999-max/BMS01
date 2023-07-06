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
