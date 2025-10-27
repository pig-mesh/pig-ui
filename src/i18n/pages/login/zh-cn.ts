// 定义内容
export default {
	// 通用
	signInText: '欢迎回来！',
	browserMsgText: '* 温馨提示：建议使用谷歌、Microsoft Edge，版本 80 及以上浏览器，360浏览器请使用极速模式',

	// 标签与链接
	label: {
		one1: '用户名登录',
		two2: '手机号登录',
		three3: '社交登录',
		register: '注册账号',
	},
	link: {
		one3: '第三方登录',
		two4: '友情链接',
	},

	// 分割线
	divider: {
		or: '或',
	},

	// 密码登录
	password: {
		accountPlaceholder1: '请输入用户名',
		accountPlaceholder2: '请输入密码',
		accountPlaceholder3: '请输入验证码',
		phonePlaceholder4: '请输入手机号',
		tenantPlaceholder: '请选择租户',
		accountBtnText: '登 录',
		resetBtnText: '重 置',
		registerBtnText: '注 册',
		readAccept: '我已仔细阅读并接受',
		privacyPolicy: '《隐私政策》',
		oldPassword: '请输入原密码',
		newPassword: '请输入新密码',
		confirmPassword: '请确认新密码',
		backToLogin: '返回登录',
		mobileLogin: '验证码登录',
		createAccount: '注册账号',
		imageCodeTip: '请输入验证码',
		forgetPassword: '找回密码',
	},

	// 手机号登录
	mobile: {
		placeholder1: '请输入手机号',
		placeholder2: '请输入验证码',
		codeText: '获取验证码',
		btnText: '登 录',
		mobileLogin: '验证码登录',
		backToLogin: '返回登录',
		createAccount: '注册账号',
		sendSuccess: '验证码发送成功',
		seconds: '秒后重发',
		mobileRequired: '请输入手机号码',
		codeRequired: '请输入验证码',
		codeLength: '验证码必须是4位数字',
		sendFailed: '发送验证码失败',
		loginSuccess: '登录成功',
		loginFailed: '登录失败',
		signIn: '登 录',
	},

	// 注册
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
		registerSuccess: '注册成功',
		// 校验与提示
		tenantEmpty: '请选择租户',
		tenantLoadError: '获取租户列表失败',
		usernameEmpty: '用户名不能为空',
		usernameLength: '用户名称长度必须介于 5 和 20 之间',
		phoneEmpty: '手机号不能为空',
		passwordEmpty: '密码不能为空',
		passwordLength: '用户密码长度必须介于 6 和 20 之间',
		passwordStrength: '密码强度太低',
		termsRequired: '请阅读并同意条款',
	},

	// 忘记密码
	forget: {
		title: '重置密码',
		username: '用户名',
		mobile: '手机号',
		code: '验证码',
		newPassword: '新密码',
		confirmPassword: '确认密码',
		submit: '重置密码',
		backToLogin: '返回登录',
		resetSuccess: '密码重置成功',
		// 占位与规则
		newPasswordPlaceholder: '请输入新密码',
		confirmPasswordPlaceholder: '请确认新密码',
		passwordEmpty: '密码不能为空',
		passwordLength: '用户密码长度必须介于 6 和 20 之间',
		passwordRule: '两次输入的密码不一致',
		passwordScore: '密码强度太低',
	},

	// 密码过期
	expire: {
		title: '密码已过期',
		oldPassword: '请输入原密码',
		newPassword: '请输入新密码',
		confirmPassword: '请确认新密码',
		submit: '更新密码',
		updateSuccess: '密码更新成功',
		passwordRule: '两次输入的密码不一致',
		passwordScore: '密码强度太低',
		resetSuccess: '密码重置成功',
	},

	// 扫码登录
	scan: {
		text: '打开微信扫一扫，快速登录/注册',
		wechatApp: '微信扫码体验移动端',
		appErrorTip: '应用未配置，登录失败',
	},

	// 社交平台
	social: {
		title: '社交登录',
		wechat: '微信',
		qq: 'QQ',
		weibo: '微博',
		github: 'GitHub',
		gitee: 'Gitee',
		alipay: '支付宝',
		baidu: '百度',
	},
	// 社交登录按钮
	socialLogin: {
		wechatWork: '企微',
		dingtalk: '钉钉',
		bindSuccess: '社交账号绑定成功',
		missingParams: '缺少必要参数: code 或 state',
	},

	// 租户选择
	tenant: {
		placeholder: '请选择租户',
		noData: '暂无租户数据',
		loadError: '加载租户列表失败',
	},
	tenantSelect: {
		select: '选择租户',
		loadError: '获取租户列表失败',
	},

	// 控制组件
	control: {
		theme: '主题',
		language: '语言',
		fullscreen: '全屏',
		exitFullscreen: '退出全屏',
		toggleLightMode: '切换亮色模式',
		toggleDarkMode: '切换暗色模式',
	},

	// 校验
	verify: {
		imageCode: '请输入验证码',
	},
	validation: {
		usernameFormat: '用户名支持小写英文、数字',
		usernameExists: '用户名已经存在',
		phoneExists: '手机号已经存在',
	},

	// 错误消息
	errors: {
		loginFailed: '用户名不存在或者密码错误',
		networkError: '网络错误，请重试',
		validationError: '请填写所有必填字段',
		unauthorized: '未经授权的访问',
	},

	// 锁屏
	lockScreen: {
		slideToUnlock: '上滑解锁',
		enterPassword: '请输入密码',
		passwordError: '密码错误',
		unlockSuccess: '解锁成功',
	},
};
