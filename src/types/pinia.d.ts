/**
 * pinia 类型定义
 */

// 角色信息
declare interface RoleItem {
	roleId: string;
	roleName: string;
	roleCode: string;
	roleDesc: string;
	dsType: number;
	dsScope: string;
}

// 部门信息
declare interface DeptItem {
	deptId: string;
	name: string;
	sortOrder: number;
	parentId: string | null;
}

// 岗位信息
declare interface PostItem {
	postId: string;
	postCode: string;
	postName: string;
	postSort: number;
	remark: string;
}

// 用户信息
declare interface UserInfosState<T = any> {
	userInfos: {
		authBtnList: string[];
		photo: string;
		roles: RoleItem[];
		deptList: DeptItem[];
		time: number;
		userName: string;
		tenantId: string;
		tenantName: string;
		[key: string]: T;
	};
}

// 路由缓存列表
declare interface KeepAliveNamesState {
	keepAliveNames: string[];
	cachedViews: string[];
	// 记录已关闭的路由路径，用于强制刷新
	closedRoutes: Set<string>;
}

// 后端返回原始路由(未处理时)
declare interface RequestOldRoutesState {
	requestOldRoutes: string[];
}

// TagsView 路由列表
declare interface TagsViewRoutesState<T = any> {
	tagsViewRoutes: T[];
	isTagsViewCurrenFull: Boolean;
	favoriteRoutes: T[];
}

// 路由列表
declare interface RoutesListState<T = any> {
	routesList: T[];
	isColumnsMenuHover: Boolean;
	isColumnsNavHover: Boolean;
}

// 布局配置
declare interface ThemeConfigState {
	themeConfig: {
		isDrawer: boolean;
		primary: string;
		topBar: string;
		topBarColor: string;
		isTopBarColorGradual: boolean;
		menuBar: string;
		menuBarColor: string;
		menuBarActiveColor: string;
		isMenuBarColorGradual: boolean;
		columnsMenuBar: string;
		columnsMenuBarColor: string;
		isColumnsMenuBarColorGradual: boolean;
		isColumnsMenuHoverPreload: boolean;
		isCollapse: boolean;
		isUniqueOpened: boolean;
		isFixedHeader: boolean;
		isFixedHeaderChange: boolean;
		isClassicSplitMenu: boolean;
		isLockScreen: boolean;
		lockScreenTime: number;
		isShowLogo: boolean;
		isShowLogoChange: boolean;
		isBreadcrumb: boolean;
		isTagsview: boolean;
		isBreadcrumbIcon: boolean;
		isTagsviewIcon: boolean;
		isCacheTagsView: boolean;
		isSortableTagsView: boolean;
		isShareTagsView: boolean;
		isFooter: boolean;
		isGrayscale: boolean;
		isInvert: boolean;
		isDark: boolean;
		isWartermark: boolean;
		isChat: boolean;
		wartermarkText: string;
		quickLinkNum: number;
		tagsStyle: string;
		animation: string;
		columnsAsideStyle: string;
		columnsAsideLayout: string;
		layout: string;
		isRequestRoutes: boolean;
		globalTitle: string;
		globalI18n: string;
		globalComponentSize: string;
		footerAuthor: string;
		background: string;
		miniQr: string;
	};
}
