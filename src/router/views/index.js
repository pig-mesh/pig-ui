import Layout from '@/page/index/index.vue'
import Store from '@/store/'

export default [{
  path: '/wel',
  component: () => Store.getters.isMacOs ? import('@/mac/index.vue') : import('@/page/index/index.vue'),
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/index.vue')
  }, {
    path: 'dashboard',
    name: '控制台',
    meta: {
      i18n: 'dashboard',
      menu: false,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/dashboard.vue')
  }]
}, {
  path: '/iframe',
  component: Layout,
  redirect: '/iframe',
  children: [{
    path: '',
    name: '',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/components/iframe/main.vue')
  }]
}, {
  path: '/activti',
  component: Layout,
  redirect: '/activti/detail',
  children: [{
    path: 'detail/:id',
    component: () =>
      import(/* webpackChunkName: "views" */ '@/views/activiti/detail')
  }]
}]
