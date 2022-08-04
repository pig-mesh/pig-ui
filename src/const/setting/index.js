const dicData = [{
  label: '关闭',
  value: 'false'
},{
  label: '开启',
  value: 'true'
}]
export const list = [{
  key: 'showTag',
  commit: 'SET_SHOW_TAG'
}, {
  key: 'showTheme',
  commit: 'SET_SHOW_THEME'
}, {
  key: 'showColor',
  commit: 'SET_SHOW_COLOR'
}, {
  key: 'showLock',
  commit: 'SET_SHOW_LOCK'
}, {
  key: 'showDebug',
  commit: 'SET_SHOW_DEBUG'
}, {
  key: 'showFullScreen',
  commit: 'SET_SHOW_FULL_SCREEN'
}, {
  key: 'showCollapse',
  commit: 'SET_SHOW_COLLAPSE'
}, {
  key: 'showSearch',
  commit: 'SET_SHOW_SEARCH'
}, {
  key: 'showMenu',
  commit: 'SET_SHOW_MENU'
}]
export const option = (safe) => {
  const _safe = safe
  return {
    submitBtn: false,
    emptyBtn: false,
    column: [{
      label: '标签',
      prop: 'showTag',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '日志',
      prop: 'showDebug',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '主题',
      prop: 'showTheme',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '主题色',
      prop: 'showColor',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '全屏',
      prop: 'showFullScreen',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '锁屏',
      prop: 'showLock',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '缩放',
      prop: 'showCollapse',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '顶部菜单',
      prop: 'showMenu',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }]
  }
}
