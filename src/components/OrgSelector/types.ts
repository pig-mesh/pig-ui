/**
 * 组织选择器支持的选择类型
 * - user: 仅用户
 * - dept: 仅部门
 * - role: 仅角色
 * - post: 仅岗位
 * - org:  混合模式（用户+部门+角色+岗位）
 */
export type OrgSelectType = 'user' | 'dept' | 'role' | 'post' | 'org';

/**
 * 组织选择器中的可选项（用户、部门、角色、岗位的统一结构）
 */
export interface OrgItem {
	id: string | number;
	name: string;
	/** 项目类型，用于区分用户/部门/角色/岗位 */
	type?: OrgSelectType;
	/** 是否被选中 */
	selected?: boolean;
	/** 状态：0=禁用 */
	status?: number;
	/** 用户头像（仅 type=user 时存在） */
	avatar?: string;
	/** 角色名（仅 type=role 时存在） */
	roleName?: string;
	/** 岗位名（仅 type=post 时存在） */
	postName?: string;
	[key: string]: any;
}

/**
 * 按类型分组的数据列表项，用于 selectBox 和 selectResult 展示
 */
export interface OrgDataGroup {
	type: string;
	data: OrgItem[];
	/** 取消选中的回调（仅 selectResult 使用） */
	cancel?: (item: OrgItem) => void;
}
