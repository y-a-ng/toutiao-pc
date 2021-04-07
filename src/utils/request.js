/*
  基于axios封装的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建一个axios实例，说白了就是复制一个axios
// 我们请求通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://api-toutiao-web.itheima.net/',
  // 定制后端返回的原始数据的处理
  // 参数data就是后端返回的原始数据(未经处理的JSON格式字符串)
  // http://api-toutiao-web.itheima.net/
  // 定制后端返回的原始数据的处理
  // 参数data就是后端返回的原始数据(未经处理的JSON格式)
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // axios默认在内部使用 JSON.parse来转换处理原始数据
    // console.log(data)
    // return JSON.parse(data)
    try {
      // 后端返回的数据可能不是JSON字符串
      // 如果不是的话，那么JSONbig.parse调用就会报错
      // 所以我们使用 try-catch来捕获异常，处理异常的发生
      // 如果转换成功，则直接把数据返回
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求数据
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  // 任何所有请求会经过这里
  // config是当前请求相关的配置信息对象
  // config是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 然后我们就可以在允许请求出去之前定制统一业务功能处理
    // 例如：统一的设置token
    // 当这里return config之后，请求才会真正的发出去
    return config
    // 请求失败会经过这里
  }, function (error) {
    return Promise.reject(error)
  })

// 导出请求方法
export default request
