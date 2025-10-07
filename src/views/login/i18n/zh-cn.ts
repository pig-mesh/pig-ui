/**
 * 登录模块中文语言配置
 */
export default {
  // 通用登录文本
  signInText: '欢迎回来！',
  browserMsgText: '请使用最新版Chrome、Firefox、Safari或Edge浏览器获得更好体验',

  // 分割线文本
  divider: {
    or: '或'
  },

  // 密码登录文本
  password: {
    accountPlaceholder1: '请输入用户名',
    accountPlaceholder2: '请输入密码',
    accountBtnText: '登录',
    mobileLogin: '手机号登录',
    forgetPassword: '忘记密码？',
    createAccount: '注册账号',
    imageCodeTip: '请输入图片验证码'
  },

  // 手机号登录文本
  mobile: {
    placeholder1: '请输入手机号',
    placeholder2: '请输入验证码',
    signIn: '登录',
    backToLogin: '返回密码登录',
    createAccount: '注册账号',
    mobileRequired: '请输入手机号',
    codeRequired: '请输入验证码',
    codeLength: '验证码必须为4位数字',
    codeText: '获取验证码',
    seconds: '秒',
    sendSuccess: '验证码发送成功',
    sendFailed: '验证码发送失败',
    loginSuccess: '登录成功'
  },

  // 注册文本
  register: {
    title: '注册账号',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    mobile: '手机号',
    email: '邮箱',
    submit: '注册',
    backToLogin: '返回登录',
    passwordMismatch: '两次输入的密码不一致',
    registerSuccess: '注册成功'
  },

  // 忘记密码文本
  forget: {
    title: '重置密码',
    username: '用户名',
    mobile: '手机号',
    code: '验证码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    submit: '重置密码',
    backToLogin: '返回登录',
    resetSuccess: '密码重置成功'
  },

  // 密码过期文本
  expire: {
    title: '密码已过期',
    oldPassword: '旧密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    submit: '更新密码',
    updateSuccess: '密码更新成功'
  },

  // 社交登录文本
  social: {
    title: '社交登录',
    wechat: '微信',
    qq: 'QQ',
    weibo: '微博',
    github: 'GitHub',
    gitee: 'Gitee',
    alipay: '支付宝',
    baidu: '百度'
  },

  // 租户选择文本
  tenant: {
    placeholder: '请选择租户',
    noData: '暂无租户数据',
    loadError: '加载租户列表失败'
  },

  // 控制组件文本
  control: {
    theme: '主题',
    language: '语言',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏'
  },

  // 错误消息
  errors: {
    loginFailed: '登录失败，请检查您的凭据',
    networkError: '网络错误，请重试',
    validationError: '请填写所有必填字段',
    unauthorized: '未经授权的访问'
  }
};