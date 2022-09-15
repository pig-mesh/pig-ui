/**
 * 全局配置文件
 */
export default {
  title: 'PIG 快速开发框架',
  subtitle: 'PIG',
  logo: "P",
  indexTitle: "PIG 快速开发框架",
  copyright: 'Copyright © 2022 pig4cloud.com. All rights reserved.',
  key: 'pig',//配置主键,目前用于存储
  lockPage: '/lock',
  tokenTime: 3000,
  validateCode: true,
  websocket: false, // 是否开启websocket
  whiteList: ['/login', '/404', '/401', '/lock'], // 配置无权限可以访问的页面
  whiteTagList: ['/login', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  setting: {
    sidebar: 'vertical',
    tag: true,
    debug: true,
    collapse: true,
    search: true,
    lock: true,
    fullscren: true,
    theme: true,
    menu: true
  },
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    label: 'label',
    path: 'path',
    icon: 'icon',
    children: 'children',
    query: 'query',
    href: 'href',
    meta: 'meta'
  }
}
