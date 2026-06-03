export default {
	sysrole: {
		index: '#',
		roleName: '角色名称',
		inputRoleNameTip: '请输入角色名称',
		permissionTip: '授权',
		deleteDisabledTip: '角色不允许删除',
			mustCheckOneTip: '必须选择【分配权限】菜单',
			roleCode: '角色标识',
			roleDesc: '角色描述',
			createTime: '创建时间',
			please_enter_a_role_name: '请输入角色名称',
			please_enter_the_role_Code: '请输入角色标识',
			please_enter_the_role_description: '请输入角色描述',
			please_select: '请选择',
			importRoleTip: '导入角色',
		assignPermission: '分配权限',
		homePage: '首页',
		update: '更新',
		cancel: '取 消',
		// 表单验证
		roleNameRequired: '角色名称不能为空',
			roleNameLength: '长度在 3 到 20 个字符',
			roleCodeRequired: '角色标识不能为空',
			roleCodeLength: '长度在 3 到 20 个字符',
			// 错误提示
			fetchRoleDataError: '获取角色数据失败',
			fetchPermissionDataError: '获取权限数据失败',
		permissionUpdateError: '权限分配失败',
		roleCodeExists: '角色标识已经存在',
		roleNameExists: '角色名称已经存在',
		// 权限分配
		assignPermissionMenu: '分配权限',
		// 缓存刷新
		refreshCache: '刷新缓存',
		refreshCacheSuccess: '缓存刷新成功',
		refreshCacheError: '缓存刷新失败',
		// 首页组件配置（widget.vue）
		widget: {
			drawerTitle: '角色「{name}」的首页配置',
			availableComponents: '可用组件',
			searchPlaceholder: '搜索组件...',
			loadError: '加载配置失败',
			resetDefault: '重置为默认'
		},
	},
};
