import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import user from './mockServeData/user'
import permission from './mockServeData/permission'

// 定义mock请求拦截
Mock.mock('/api/home/getData', 'get', homeApi.getStatisticalData);
// 用户列表的数据
Mock.mock('/api/user/add', 'post', user.createUser);
Mock.mock('/api/user/edit','post', user.updateUser);
Mock.mock('/api/user/del', 'post', user.deleteUser);
Mock.mock(/api\/user\/getUser/, 'get', user.getUserList);

Mock.mock(/api\/permission\/getMenu/, 'post',permission.getMenu);

// // 定义 mock请求拦截
// Mock.mock('/api/home/getData', 'get', function(){
//   // 拦截到请求后的处理逻辑
//   return []; //return的内容是data
// })