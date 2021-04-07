import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由导航守卫 (拦截器) 的作用就是控制页面的访问状态
// beforeEach是全局签制守卫，任何页面的访问都要经过这里
// 在VueCLI 创建的项目中，@表示src目录
// 它是src目录的路径别名
// 好处：不受当前文件路径的影响
// 建议：凡是需要父级路基查找的都使用@,
// 如果加载的资源路径就在当前目录下，那就正常写
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment/'
import Settings from '@/views/settings'
Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
    // component: () => import('@/views/login')
  },
  {
    path: '/',
    // 命名路由layout有一个默认子路由，这个名字没有意义，所以警告
    // 正确的做法：如果有默认子路由，就不要给父路由起名字
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '/', // path 为空，会作为默认子路由渲染
        // 组件的name是为了更规范，
        // 路由的name是为了方便动态传参，两者是不一样的
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'setting',
        component: Settings
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

// 路由导航守卫：所有页面的导航都会经过这里
// 守卫页面导航的
// to: 要去的页面信息
// from: 来自哪儿的路由信息
// next:放行的方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login,校验登陆状态
  // 如果没有登录，则跳转到登陆页面
  // 如果登录了，则允许通过
  // console.log('页面进来了')
  // console.log(to)
  // console.log(from)
  // 允许通过

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登陆页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登陆页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
