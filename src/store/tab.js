import Cookie from 'js-cookie'
export default {
  state: {
    isCollapse: false, // 控制侧边栏折叠
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 's-home',
        url: 'Home/Home'
      }
    ], // 面包屑
    menu: []
  },
  mutations: {
    // 修改菜单折叠方法，会传入一个变量stated
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse;
    },
    // 面包屑更新数据
    selectMenu(state, val) {
      // 判断添加的数据是否是首页,如果不是，就从上面的数据找所点击的侧边栏是第几个
      if (val.name !== 'home') {
        const index = state.tabsList.findIndex(item => item.name === val.name);
        // 如果没有找到，即不存在,就加到上面去
        if (index === -1) {
          state.tabsList.push(val);
        }
      }//home
    },//selectMenu
    // 删除指定的tag数据
    closeTag(state, item) {
      const index = state.tabsList.findIndex(val => val.name === item.name);
      state.tabsList.splice(index, 1);
    },//closeTag
    // 设置menu(路由)的数据
    setMenu(state, val) {
      state.menu = val;
      Cookie.set('menu',JSON.stringify(val)); // cookie的值必须是字符串
    },
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
        }else{
          item.component = () => import(`../views/${item.url}`)
          menuArray.push(item)
        }
      });//forEach
      // console.log(menuArray);
      // 路由动态添加
      menuArray.forEach(item => {
        router.addRoute('main',item); // 添加到路由表name='main'的主路由里面
      })
    }, //addMenu
  }
}