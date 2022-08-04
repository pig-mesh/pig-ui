
function randomColor () {
  return '#' + Math.random().toString(16).substr(2, 6).toUpperCase();
}
const top = [{
  label: "首页",
  path: "/wel/index",
  icon: 'el-icon-document',
  meta: {
    i18n: 'dashboard',
  },
  parentId: 0
},
{
  label: "测试",
  icon: 'el-icon-document',
  path: "/test",
  meta: {
    i18n: 'test',
  },
  parentId: 1
},
{
  label: "更多",
  icon: 'el-icon-document',
  path: "/wel/more",
  meta: {
    menu: false,
    i18n: 'more',
  },
  parentId: 2
}]
const first = [{
  label: "缓冲",
  path: '/cache',
  component: 'views/util/cache',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'cache',
    keepAlive: true
  },
  children: []
}, {
  label: "参数",
  path: '/params',
  component: 'views/util/params',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'params',
  },
}, {
  label: "标签",
  path: '/tags',
  component: 'views/util/tags',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'tags',
  },
  children: []
}, {
  label: "存储",
  path: '/store',
  component: 'views/util/store',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'store',
  },
  children: []
}, {
  label: "日志监控",
  path: '/logs',
  component: 'views/util/logs',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'logs',
  },
  children: []
}, {
  label: "返回顶部",
  path: '/top',
  component: 'views/util/top',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'top',
  },
  children: []
}, {
  label: "图钉",
  path: '/affix',
  component: 'views/util/affix',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'affix',
  },
  children: []
}, {
  label: '多级菜单',
  path: '/deep',
  iconBgColor: randomColor(),
  children: [{
    label: '多级菜单1-1',
    path: 'deep',
    iconBgColor: randomColor(),
    children: [{
      label: '多级菜单2-1',
      path: 'deep',
      iconBgColor: randomColor(),
      component: 'views/util/deep',
    }]
  }]
}, {
  label: "外部页面",
  path: '/out',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'out',
  },
  children: [{
    label: "官方网站(内嵌页面)",
    path: 'website',
    href: 'https://avuejs.com',
    icon: 'icon-caidan',
    iconBgColor: randomColor(),
    meta: {
      i18n: 'website',
    }
  }, {
    label: "全局函数(外链页面)",
    path: 'api',
    href: 'https://avuejs.com/docs/api?test1=1&test2=2',
    icon: 'icon-caidan',
    iconBgColor: randomColor(),
    meta: {
      target: '_blank',
      i18n: 'api',
    }
  }]
}, {
  label: "表格",
  path: '/table',
  component: 'views/util/table',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'table',
  },
  children: []
}, {
  label: "表单",
  path: '/form',
  component: 'views/util/form',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'form'
  },
  children: []
}, {
  label: "异常页",
  path: '/error',
  meta: {
    i18n: 'error',
  },
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  children: [{
    label: "error403",
    path: 'error',
    component: 'components/error-page/403',
    icon: 'icon-caidan',
    iconBgColor: randomColor(),
    children: []
  }, {
    label: "error404",
    path: '404',
    component: 'components/error-page/404',
    icon: 'icon-caidan',
    iconBgColor: randomColor(),
    children: []
  }, {
    label: "error500",
    path: '500',
    component: 'components/error-page/500',
    icon: 'icon-caidan',
    iconBgColor: randomColor(),
    children: []
  }]
}, {
  label: "关于",
  path: '/about',
  component: 'views/util/about',
  icon: 'icon-caidan',
  iconBgColor: randomColor(),
  meta: {
    i18n: 'about',
  },
  children: []
}]
const second = [{
  label: "测试页面",
  path: '/test',
  component: 'views/util/test',
  icon: 'icon-caidan',
  meta: {
    i18n: 'test',
  },
  children: []
}]
let menu = [first, second];
export default [{
  url: "/user/getMenu",
  method: "get",
  response: ({ query }) => {
    return {
      data: menu[query.type || 0] || []
    }
  }
}, {
  url: "/user/getTopMenu",
  method: "get",
  response: () => {
    return {
      data: top
    }
  }
}]