/**
 * mention 自定义元素类型定义
 * 用于 wangeditor-next 打印模板的 @变量 功能
 */
type EmptyText = {
	text: '';
};

export interface MentionElement {
	type: 'mention';
	value: string;    // 变量标识，如 'form.userName'
	label: string;    // 显示名称，如 '用户名'
	category: string; // 分类：'process' | 'form' | 'approval'
	children: EmptyText[];
}
