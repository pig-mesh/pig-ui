/**
 * OrgSelector 组件的共享状态和数据获取方法
 *
 * 注意：此模块使用模块级 ref，所有引用该模块的组件实例共享同一份状态。
 * 这是有意设计的——当 employeesDialog 打开时，selectBox 和搜索框需要操作同一份数据。
 * 但如果页面上同时存在多个 OrgSelector 实例，它们会共享数据，请注意避免冲突。
 */

import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { deptRoleList } from '/@/api/admin/role';
import { orgTree, orgTreeSearcheUser } from '/@/api/admin/dept';

/** 搜索关键词（双向绑定到搜索输入框） */
export const searchVal = ref('');

/** 组织树数据：包含部门、用户、角色、岗位列表 */
export const departments = ref({
	titleDepartments: [],
	childDepartments: [],
	roleList: [],
	employees: [],
	postList: [],
});

/** 角色列表数据 */
export const roles = ref({});

/** 获取角色列表 */
export const getRoleList = async () => {
	const { data: { list } } = await deptRoleList();
	roles.value = list;
};

/**
 * 获取组织树数据（部门、用户、角色、岗位）
 * @param parentId - 父级部门 ID，0 表示根节点
 * @param type - 选择类型，决定后端返回哪些数据
 */
export const getDepartmentList = async (parentId = 0, type = 'org') => {
	const { data } = await orgTree(type, parentId);
	departments.value = data;
};

/**
 * 搜索处理：有关键词时搜索用户，清空时重新加载列表
 * @param keyword - 搜索关键词
 * @param type - 1=搜索用户列表，2=搜索角色列表
 */
const searchHandler = async (keyword: string, type = 1) => {
	if (keyword) {
		if (type === 1) {
			departments.value.childDepartments = [];
			const { data } = await orgTreeSearcheUser({ username: keyword, pageNum: 1, pageSize: 30 });
			departments.value.employees = data;
		}
	} else {
		type === 1 ? await getDepartmentList() : await getRoleList();
	}
};

/** 防抖搜索（300ms），避免输入时频繁请求 */
export const getDebounceData = useDebounceFn(searchHandler, 300);
