import Store from '@/store/'
export default [{
  path: '/login',
  name: '登录页',
  component: () =>
    Store.getters.isMacOs ? import('@/mac/login.vue') : import('@/page/login/index.vue'),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/lock',
  name: '锁屏页',
  component: () =>
    Store.getters.isMacOs ? import('@/mac/lock.vue') : import('@/page/lock/index.vue'),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/404',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/components/error-page/404.vue'),
  name: '404',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }

},
{
  path: '/403',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/components/error-page/403.vue'),
  name: '403',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/500',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/components/error-page/500.vue'),
  name: '500',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/',
  name: '主页',
  redirect: '/wel'
}]