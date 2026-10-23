/** 首页卡片和角色工作台配置共用的元数据。 */
export const dashboardWidgets: Record<string, { title: string; icon: string; description: string }> = {
	'browser-distribution': {
		title: '浏览器分布',
		icon: 'ChromeFilled',
		description: 'Clarity 浏览器访问分布',
	},
	calendar: {
		title: '日程管理',
		icon: 'Calendar',
		description: '日历组件展示',
	},
	'current-user': {
		title: '当前用户',
		icon: 'User',
		description: '获取当前用户信息展示',
	},
	'device-distribution': {
		title: '设备分布',
		icon: 'Monitor',
		description: 'Clarity 设备分布统计',
	},
	'favorite-menu': {
		title: '常用功能',
		icon: 'Star',
		description: '常用功能收藏',
	},
	news: {
		title: '系统公告',
		icon: 'MuteNotification',
		description: '系统公告展示',
	},
	'popular-pages': {
		title: '热门页面',
		icon: 'TrendCharts',
		description: 'Clarity 热门页面访问排行',
	},
	'session-uv-summary': {
		title: '会话访客',
		icon: 'DataLine',
		description: 'Clarity 总会话数与独立访客',
	},
	'sys-log-line': {
		title: '请求折线图',
		icon: 'DocumentCopy',
		description: '折线图示例',
	},
	'sys-log': {
		title: '系统日志',
		icon: 'Monitor',
		description: '系统日志列表',
	},
};
