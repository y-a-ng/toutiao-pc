/*
  用户相关请求模块
*/
//  用户登录
import request from '@/utils/request'
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // data用来设置post请求体
    data
  })
}
//  获取用户信息
export const getUserProfile = () => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  console.log(user)
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile',
    // 后端要求，把需要授权的用户身份放到请求头中
    // axios可以通过header选项设置请求头
    headers: {
      // 属性名和值都得看接口的要求
      // 属性名：Authorization 看文档接口要求填写
      // 属性值：Bearer空格token数据
      Authorization: `Bearer ${user.token}`
    }
  })
}
//  修改用户信息
export const updateUser = () => {

}
