import http from '../utis/request'

// 定义接口，请求首页数据，/home/getData是后端过来的url,现在是 mock模拟
export const getData = () => {
  return http.get('/home/getData');  //返回一个promise对象
}

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

export const getMenu = (data) => {
  return http.post('/permission/getMenu',data);
}