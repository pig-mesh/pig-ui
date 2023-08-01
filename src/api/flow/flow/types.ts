/**
 * 菜单视图对象类型
 */
export interface FlowVO {
	stop?: boolean;
	updated?: string;

	/**
	 * 菜单ID
	 */
	formId?: string;
	/**
	 * 菜单名称
	 */
	formName?: string;
}
